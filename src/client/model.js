import { BehaviorSubject } from 'rx';

export function getModel(navigationIntent, receive) {
  return {
    drinkList$: navigationIntent.drinkList$
      .map(() => receive.drinks.all())
      .switch()
      .flatMap(response$ => response$)
      .map(response => response.body.drinks),
    flash$: receive.any
      .flatMap(response$ => response$)
      .filter(response => response.body.successes || response.body.errors)
      .map(response => ({ successes: response.body.successes, errors: response.body.errors }))
      .startWith({ successes: [], errors: [] }),
    query$: new BehaviorSubject(''),
    user$: new BehaviorSubject(null),
  };
}
