
const API_CONFIG = {
  local: {
    baseUrl: "http://localhost:8000",
    apiKey: "local-test-api-key",
  },
  flask: {
    baseUrl: "http://localhost:5000",
    apiKey: "local-test-api-key",
  },
  production: {
    baseUrl: "https://hazedefy.onrender.com",
    apiKey: "your-production-api-key",
  }
};


const CURRENT_ENV = "production"; 

export const API_BASE_URL = API_CONFIG[CURRENT_ENV].baseUrl;
export const API_KEY = API_CONFIG[CURRENT_ENV].apiKey;
