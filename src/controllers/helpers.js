import Promise from 'bluebird'

export const render = Promise.method((res, view) => {
  res.render(view, res.locals);
});

export function setLocals(res, object) {
  Object.keys(object).forEach(key => res.locals[key] = object[key]);
}

export function created(res, hrefToCreated) {
  res.redirect(hrefToCreated);
}

export function updated(res, hrefToUpdated) {
  res.redirect(hrefToUpdated);
}

export function deleted(res, returnTo) {
  res.redirect(returnTo);
}
