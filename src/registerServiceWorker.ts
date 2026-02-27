export const registerServiceWorker = (): void => {
  if (!import.meta.env.PROD) {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('single-todo: service worker registration failed', error);
    });
  });
};
