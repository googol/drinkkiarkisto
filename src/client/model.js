import { Observable } from 'rx';

export function getModel(navigationIntent, receive) {
  return {
    drink$: navigationIntent.drink$
      .flatMapLatest(({ drinkId }) => receive.drinks.single(drinkId).mergeAll())
      .map(response => response.body.drink),

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
      .map(response => response.body.user)
      .startWith(null),

    redirectTo$: navigationIntent.redirectTo$.map(param => param.path),
  };
}
