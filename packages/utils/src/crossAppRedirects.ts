/**
 * Internal navigation utilities
 * Handles navigation within the standalone SMS Hub Web app
 */

export const getAdminUrl = (path: string = "") => {
  return `/admin${path}`;
};

export const getPricingUrl = (path: string = "") => {
  return `/pricing${path}`;
};

export const getContactUrl = (path: string = "") => {
  return `/contact${path}`;
};

export const getHomeUrl = (path: string = "") => {
  return `/${path}`;
};

export const redirectToAdmin = (path: string = "") => {
  window.location.href = getAdminUrl(path);
};

export const redirectToPricing = (path: string = "") => {
  window.location.href = getPricingUrl(path);
};

export const redirectToContact = (path: string = "") => {
  window.location.href = getContactUrl(path);
};

export const redirectToHome = (path: string = "") => {
  window.location.href = getHomeUrl(path);
};
