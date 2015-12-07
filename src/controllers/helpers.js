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
  res.format({
    'text/html': () => res.redirect(hrefToCreated),
    'default': () => res.status(201).set('Location', hrefToCreated).end(),
  });
}

export function updated(res, hrefToUpdated) {
  res.format({
    'text/html': () => res.redirect(hrefToUpdated),
    'default': () => res.status(200).set('Location', hrefToUpdated).end(),
  });
}

export function deleted(res, returnTo) {
  res.format({
    'text/html': () => res.redirect(returnTo),
    'default': () => res.status(204).end(),
  });
}
