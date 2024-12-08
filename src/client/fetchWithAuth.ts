export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
        const jwt = localStorage.getItem('session_jwt');
        return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${jwt}`
            }
          });
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};