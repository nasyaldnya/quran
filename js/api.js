import { showToast } from './utils.js';

const API_BASE_URL = 'https://mp3quran.net/api/v3';

// Applying the requested Retry Logic
async function fetchDataWithRetry(endpoint, signal, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, { signal });
            if (!response.ok) {
                 // Throw an error to be caught by the catch block
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted.');
                throw error; // Re-throw abort error to stop retries
            }
            console.warn(`Fetch attempt ${i + 1} failed for ${endpoint}. Retrying in ${delay * Math.pow(2, i)}ms...`);
            if (i === retries - 1) {
                 // If this was the last retry, throw the error to be handled by the caller
                 throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}


export const fetchData = async (endpoint, signal) => {
    try {
        return await fetchDataWithRetry(endpoint, signal);
    } catch (error) {
        if (error.name !== 'AbortError') {
             // Better error message
            console.error("Failed to fetch data after multiple retries:", error);
            showToast('فشل تحميل البيانات. تحقق من اتصالك بالإنترنت.', 'error');
        }
        return null;
    }
};