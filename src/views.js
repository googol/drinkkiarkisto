import { Observable } from 'rx';
import { renderHeader } from './views/header';
import { renderApp } from './views/app';
import { renderDrinkList } from './views/drinkList';

export function getView(model) {
  const drinkListView$ = Observable.combineLatest(
    model.drinkList$,
    model.user$,
    (drinks, user) => renderDrinkList(drinks, user));

  const headerView$ = Observable.combineLatest(
    model.user$,
    model.query$,
    (user, query) => renderHeader(user, query));

  const content$ = Observable.merge(
    drinkListView$
  );

  return Observable.combineLatest(
    headerView$,
    content$,
    model.flash$,
    (header, content, flashes) => renderApp(header, content, flashes.successes, flashes.errors));
}
