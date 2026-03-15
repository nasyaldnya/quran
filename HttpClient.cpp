#include <functional>
#include <cstring>

#include "HttpClient.h"
#include "Logger.h"

#pragma comment(lib, "Wininet.lib")

// ─── Retry helper ─────────────────────────────────────────────────────────────
//
// withRetry drives the retry loop that all public methods share.
//
// Parameters in order:
//   attempt  — callable returning NetworkError, called up to MAX_ATTEMPTS times
//   label    — human-readable operation name for log messages
//   sleepFn  — called with delay in ms before each retry (default: ::Sleep)
//              Pass a no-op in tests to avoid real waits.
//              Must not be null; if null is passed the guard below substitutes
//              ::Sleep so the delay is still honoured and no crash occurs.
//
// Parameter order matters for call sites. Production callers pass two args:
//   withRetry(lambda, "label");
// Test callers pass three, supplying a controlled sleep function:
//   withRetry(lambda, "label", [](DWORD ms){ recordedDelays.push_back(ms); });
//
// Only Timeout and ServerError are retried. All other errors are returned
// immediately. Delay sequence: 0 ms, 1000 ms, 4000 ms.

static bool isRetryable(NetworkError e) noexcept
{
    return e == NetworkError::Timeout || e == NetworkError::ServerError;
}

template<typename F>
static NetworkError withRetry(
    F&&         attempt,
    const char* label   = "HTTP request",
    void      (*sleepFn)(DWORD) = [](DWORD ms){ Sleep(ms); })
{
    // Defensive null guard: if sleepFn is null (e.g. a caller passes nullptr),
    // substitute ::Sleep so the retry delay is still honoured.
    if (sleepFn == nullptr)
        sleepFn = [](DWORD ms){ Sleep(ms); };

    NetworkError last = NetworkError::NoConnection;

    for (int i = 0; i < HttpClient::MAX_ATTEMPTS; i++)
    {
        if (HttpClient::RETRY_DELAYS_MS[i] > 0)
            sleepFn(static_cast<DWORD>(HttpClient::RETRY_DELAYS_MS[i]));

        last = attempt();

        if (last == NetworkError::None)
        {
            LOG_DEBUG(label); // success — debug level only
            return NetworkError::None;
        }

        const bool willRetry = isRetryable(last) && (i + 1 < HttpClient::MAX_ATTEMPTS);
        if (willRetry)
        {
            char buf[256];
            _snprintf_s(buf, sizeof(buf), _TRUNCATE,
                "%s failed (attempt %d/%d) — will retry. Error: %d",
                label, i + 1, HttpClient::MAX_ATTEMPTS, static_cast<int>(last));
            LOG_WARN(buf);
        }
        else if (!isRetryable(last))
        {
            // Non-retryable error — log and break immediately.
            char buf[256];
            _snprintf_s(buf, sizeof(buf), _TRUNCATE,
                "%s failed (non-retryable). Error: %d",
                label, static_cast<int>(last));
            LOG_ERROR(buf);
            return last;
        }
    }

    // All attempts exhausted.
    {
        char buf[256];
        _snprintf_s(buf, sizeof(buf), _TRUNCATE,
            "%s failed after %d attempts. Error: %d",
            label, HttpClient::MAX_ATTEMPTS, static_cast<int>(last));
        LOG_ERROR(buf);
    }
    return last;
}

// ─── Error classification ─────────────────────────────────────────────────────

NetworkError HttpClient::classifyWinInetError(DWORD lastError) noexcept
{
    switch (lastError)
    {
    case ERROR_INTERNET_TIMEOUT:
    case ERROR_INTERNET_CONNECTION_RESET:
        return NetworkError::Timeout;

    case ERROR_INTERNET_NAME_NOT_RESOLVED:
    case ERROR_INTERNET_CANNOT_CONNECT:
    case ERROR_INTERNET_CONNECTION_ABORTED:
    case ERROR_INTERNET_OPERATION_CANCELLED:
    default:
        return NetworkError::NoConnection;
    }
}

DWORD HttpClient::queryHttpStatus(HINTERNET hURL) noexcept
{
    DWORD status       = 0;
    DWORD statusSize   = sizeof(status);
    DWORD reserved     = 0;
    if (HttpQueryInfoA(hURL,
        HTTP_QUERY_STATUS_CODE | HTTP_QUERY_FLAG_NUMBER,
        &status, &statusSize, &reserved))
    {
        return status;
    }
    return 0; // Non-HTTP or query failed — treat as unknown.
}

NetworkError HttpClient::classifyHttpStatus(DWORD status) noexcept
{
    if (status == 0)                    return NetworkError::ParseError;  // couldn't query
    if (status >= 200 && status < 300)  return NetworkError::None;
    if (status >= 400 && status < 500)  return NetworkError::NotFound;
    if (status >= 500 && status < 600)  return NetworkError::ServerError;
    return NetworkError::ParseError; // 1xx, 3xx, or unusual values
}

// ─── Constructor / Destructor ─────────────────────────────────────────────────

HttpClient::HttpClient()
{
    m_hSession = InternetOpenA(
        "Wallomizer",
        INTERNET_OPEN_TYPE_PRECONFIG,
        NULL, NULL, 0);

    if (m_hSession == nullptr)
    {
        char buf[128];
        _snprintf_s(buf, sizeof(buf), _TRUNCATE,
            "InternetOpenA failed. LastError: %lu", GetLastError());
        LOG_ERROR(buf);
        // m_hSession remains nullptr; get() and download() will return
        // NetworkError::NoConnection without crashing.
    }
}

HttpClient::~HttpClient()
{
    if (m_hSession)
        InternetCloseHandle(m_hSession);
}

// ─── get() ────────────────────────────────────────────────────────────────────

HttpResult<std::string> HttpClient::get(const wchar_t* url) const
{
    HttpResult<std::string> result;

    if (m_hSession == nullptr)
    {
        result.error = NetworkError::NoConnection;
        LOG_ERROR("HttpClient::get called but session handle is null.");
        return result;
    }
    if (url == nullptr)
    {
        result.error = NetworkError::ParseError;
        LOG_ERROR("HttpClient::get called with null URL.");
        return result;
    }

    result.error = withRetry([&]() -> NetworkError
    {
        HINTERNET hURL = InternetOpenUrlW(
            m_hSession, url, NULL, 0,
            INTERNET_FLAG_NO_CACHE_WRITE | INTERNET_FLAG_RELOAD, 0);

        if (hURL == nullptr)
            return classifyWinInetError(GetLastError());

        // Check HTTP status code before reading body.
        const DWORD httpStatus = queryHttpStatus(hURL);
        const NetworkError statusErr = classifyHttpStatus(httpStatus);
        if (statusErr != NetworkError::None)
        {
            InternetCloseHandle(hURL);
            return statusErr;
        }

        // Read response body in chunks, appending to a std::string.
        std::string body;
        body.reserve(4096);

        char chunk[4096];
        DWORD bytesRead = 0;
        bool readOk = false;

        while (InternetReadFile(hURL, chunk, sizeof(chunk), &bytesRead))
        {
            if (bytesRead == 0) { readOk = true; break; }  // clean EOF
            if (static_cast<int>(body.size()) + static_cast<int>(bytesRead) > MAX_RESPONSE_BYTES)
            {
                // Response too large — surface as a parse error so the caller
                // can diagnose it rather than silently truncating.
                InternetCloseHandle(hURL);
                return NetworkError::ParseError;
            }
            body.append(chunk, bytesRead);
        }

        // Capture the error code immediately when InternetReadFile fails.
        // InternetCloseHandle below can overwrite GetLastError(), so we must
        // save it before any cleanup call.
        const DWORD readError = readOk ? 0 : GetLastError();

        InternetCloseHandle(hURL);

        if (!readOk)
            return classifyWinInetError(readError);

        result.value = std::move(body);
        return NetworkError::None;

    }, "HttpClient::get");

    return result;
}

// ─── download() ───────────────────────────────────────────────────────────────

HttpResult<void> HttpClient::download(const wchar_t* url, const wchar_t* destPath) const
{
    HttpResult<void> result;

    if (m_hSession == nullptr)
    {
        result.error = NetworkError::NoConnection;
        LOG_ERROR("HttpClient::download called but session handle is null.");
        return result;
    }
    if (url == nullptr || destPath == nullptr)
    {
        result.error = NetworkError::ParseError;
        LOG_ERROR("HttpClient::download called with null URL or destPath.");
        return result;
    }

    result.error = withRetry([&]() -> NetworkError
    {
        HINTERNET hURL = InternetOpenUrlW(
            m_hSession, url, NULL, 0,
            INTERNET_FLAG_NO_CACHE_WRITE | INTERNET_FLAG_RELOAD, 0);

        if (hURL == nullptr)
            return classifyWinInetError(GetLastError());

        // Check HTTP status before writing to disk.
        const DWORD httpStatus = queryHttpStatus(hURL);
        const NetworkError statusErr = classifyHttpStatus(httpStatus);
        if (statusErr != NetworkError::None)
        {
            InternetCloseHandle(hURL);
            return statusErr;
        }

        HANDLE hFile = CreateFileW(
            destPath,
            GENERIC_WRITE, 0, NULL,
            CREATE_ALWAYS,
            FILE_ATTRIBUTE_NORMAL, NULL);

        if (hFile == INVALID_HANDLE_VALUE)
        {
            InternetCloseHandle(hURL);
            char buf[256];
            _snprintf_s(buf, sizeof(buf), _TRUNCATE,
                "CreateFileW failed for download destination. LastError: %lu",
                GetLastError());
            LOG_ERROR(buf);
            return NetworkError::ParseError; // file system error, not network
        }

        char chunk[4096];
        DWORD bytesRead = 0, bytesWritten = 0;
        bool readOk = false;

        while (InternetReadFile(hURL, chunk, sizeof(chunk), &bytesRead))
        {
            if (bytesRead == 0) { readOk = true; break; }
            if (!WriteFile(hFile, chunk, bytesRead, &bytesWritten, NULL)
                || bytesWritten != bytesRead)  // Fix 4: partial write is also a failure
            {
                // Disk write failed or incomplete — treat as ParseError (not a
                // network problem). Remove partial file before returning.
                CloseHandle(hFile);
                InternetCloseHandle(hURL);
                DeleteFileW(destPath);
                LOG_ERROR("WriteFile failed or wrote fewer bytes than expected.");
                return NetworkError::ParseError;
            }
        }

        // Capture the error code immediately when InternetReadFile fails.
        // CloseHandle, InternetCloseHandle, and DeleteFileW below can all
        // overwrite GetLastError(), so we save it before any cleanup call.
        const DWORD readError = readOk ? 0 : GetLastError();

        CloseHandle(hFile);
        InternetCloseHandle(hURL);

        if (!readOk)
        {
            DeleteFileW(destPath); // remove partial file on read failure
            return classifyWinInetError(readError);
        }

        return NetworkError::None;

    }, "HttpClient::download"); // Fix 1: no nullptr — default ::Sleep applies

    return result;
}
