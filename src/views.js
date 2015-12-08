import { Observable } from 'rx';
import { renderHeader } from './views/header';
import { renderApp } from './views/app';
import { renderDrinkList } from './views/drinkList';
import { renderDrink } from './views/drink';

export function getView(model) {
  const drinkListView$ = Observable.combineLatest(
    model.drinkList$,
    model.user$,
    (drinks, user) => renderDrinkList(drinks, user));

  const drinkView$ = Observable.combineLatest(
    model.drink$,
    model.user$,
    (drink, user) => renderDrink(drink, user));

  const headerView$ = Observable.combineLatest(
    model.user$,
    model.query$,
    (user, query) => renderHeader(user, query));

  const content$ = Observable.merge(
    drinkListView$,
    drinkView$
  );

  return Observable.combineLatest(
    headerView$,
    content$,
    model.flash$,
    (header, content, flashes) => renderApp(header, content, flashes.successes, flashes.errors));
}
