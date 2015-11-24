import Promise from 'bluebird'

export const render = Promise.method((res, view) => {
  res.render(view, res.locals);
});

export function setLocals(res, object) {
  Object.keys(object).forEach(key => res.locals[key] = object[key]);
}
