export function formatAction(action, method) {
  return isMethodSupportedByBrowser(method) && action || `${action}?_method=${method}`;
}

export function formatMethod(method) {
  return isMethodSupportedByBrowser(method) && method || 'post';
}

function isMethodSupportedByBrowser(method) {
  return method === 'get' || method === 'post';
}
