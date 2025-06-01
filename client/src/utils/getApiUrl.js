export function getApiUrl() {
    try {
      return import.meta.env.VITE_API_URL || 'http://localhost:4000';
    } catch (err) {
      return 'http://localhost:4000';
    }
  }
  