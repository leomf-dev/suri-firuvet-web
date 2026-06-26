/**
 * Único punto de lectura de variables de entorno.
 * El resto de la app importa desde aquí — nunca import.meta.env directamente.
 */
export const env = {
  isDev: import.meta.env.DEV as boolean,

  api: {
    baseUrl: import.meta.env.VITE_URL_BASE ?? "https://suri-firuvet-ios-damii-api.onrender.com",
  },

  soap: {
    baseUrl: import.meta.env.VITE_URL_BASE_SOAP ?? "https://suri-firuvet-api-soap.onrender.com",
    namespace: "http://soap.surifiruvet.com/",
  },

  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  },
} as const;
