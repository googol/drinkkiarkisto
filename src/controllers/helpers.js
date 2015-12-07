import Promise from 'bluebird';
import path from 'path';

export const render = Promise.method((res, view) => {
  res.format({
    'text/html': () => res.sendFile(path.join(__dirname, '..', 'views', 'index.html')),
    'application/json': () => res.json(res.locals),
  });
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
