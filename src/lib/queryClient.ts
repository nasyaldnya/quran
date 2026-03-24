import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        1000 * 60 * 30, // 30 min — API data rarely changes
      gcTime:           1000 * 60 * 60, // 1 hr cache
      retry:            2,
      refetchOnWindowFocus: false,
    },
  },
})
