export const registerServiceWorker = (): void => {
  if (!import.meta.env.PROD) {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    const serviceWorkerUrl = `/sw.js?v=${encodeURIComponent(__APP_BUILD_ID__)}`;
    navigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
      console.warn('single-todo: service worker registration failed', error);
    });
  });
};
