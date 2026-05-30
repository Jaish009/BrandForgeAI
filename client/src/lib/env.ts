
//const isDev = import.meta.env.MODE === 'development';
//console.log(import.meta.env.NODE_MODE,"import.meta.env.NODE_MODE")

const isProd = import.meta.env.PROD;

const origin = typeof window !== 'undefined' ? window.location.origin : '';

export const ENV = {
    API_URL: isProd ? `${origin}/api` : `${import.meta.env.VITE_API_URL}`,
    FRONTEND_URL: `${import.meta.env.VITE_FRONTEND_URL}`,
    BASE_API_URL: isProd ? `${origin}/api/auth` : `${import.meta.env.VITE_BASE_API_URL}`
};
