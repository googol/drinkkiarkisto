import { Observable } from 'rx';

export function getModel(navigationIntent, receive) {
  return {
    drinkList$: receive.drinks.all()
      .flatMap(response$ => response$)
      .map(response => response.body.drinks),

    flash$: receive.any
      .flatMap(response$ => response$)
      .filter(response => response.body.successes || response.body.errors)
      .map(response => ({ successes: response.body.successes, errors: response.body.errors }))
      .startWith({ successes: [], errors: [] }),

    query$: Observable.just(''),

    user$: receive.users.profile()
      .flatMap(response$ => response$)
      .map(response => respose.body.user)
      .startWith(null),

    redirectTo$: navigationIntent.redirectTo$.map(param => param.path),
  };
}
