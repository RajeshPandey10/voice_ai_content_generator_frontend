// Utility function to get the API base URL
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "https://voice-ai-generator-backend.onrender.com";
};

// Utility function to construct full audio URL
export const getAudioUrl = (audioPath) => {
  if (!audioPath) return null;
  
  // If it's already a full URL (starts with http), return as is
  if (audioPath.startsWith("http")) {
    return audioPath;
  }
  
  // Otherwise, construct the full URL
  const baseUrl = getApiUrl();
  const cleanPath = audioPath.startsWith("/") ? audioPath : `/${audioPath}`;
  return `${baseUrl}${cleanPath}`;
};

// Utility function to make authenticated API calls
export const makeApiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  // Add auth token if available
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("accessToken="))
    ?.split("=")[1];
    
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  return fetch(url, finalOptions);
};
