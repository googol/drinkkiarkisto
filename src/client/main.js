import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import { makeHTTPDriver } from '@cycle/http';
import { Observable, BehaviorSubject } from 'rx';
import makeExternalLinkDriver from './externalLinkDriver';
import { renderApp, renderDrinkList, renderHeader } from '../views';
import { request, getReceive } from './httpHelpers';
import { navigationIntents } from './intent';

function main({ DOM, history, http }) {
  const receive = getReceive(http);

  const navigationIntent = navigationIntents(history);

  const drinkListModel$ = navigationIntent.drinkList$
    .map(() => receive.drinks.all())
    .switch()
    .flatMap(response$ => response$)
    .map(response => response.body.drinks);

  const flashModel$ = http
    .flatMap(response$ => response$)
    .filter(response => response.body.successes || response.body.errors)
    .map(response => ({ successes: response.body.successes, errors: response.body.errors }))
    .startWith({ successes: [], errors: [] });

  const queryModel$ = new BehaviorSubject('');
  const userModel$ = new BehaviorSubject(null);

  const drinkListView$ = Observable.combineLatest(drinkListModel$, userModel$, (drinks, user) => renderDrinkList(drinks, user));
  const headerView$ = Observable.combineLatest(userModel$, queryModel$, (user, query) => renderHeader(user, query));
  const view$ = Observable.combineLatest(headerView$, drinkListView$, flashModel$, (header, content, flashes) => renderApp(header, content, flashes.successes, flashes.errors));

  const navigateTo$ = Observable.merge(
    getInternalLinkClicks(DOM),
    navigationIntent.redirectTo$.map(param => param.path));

  const request$ = navigationIntent.drinkList$.map(() => request.drinks.all());

  return {
    DOM: view$,
    externalLink: getExternalLinkClicks(DOM),
    history: navigateTo$,
    http: request$,
  };
}

function getExternalLinkClicks(DOM) {
  return getLinkClicks(DOM)
    .do(event => { event.preventDefault(); event.stopPropagation(); })
    .map(event => event.target.href);
}

function getInternalLinkClicks(DOM) {
  return getLinkClicks(DOM)
    .filter(filterLinks)
    .map(event => event.target.pathname);
}

function getLinkClicks(DOM) {
  return DOM.select('a[rel=external]').events('click');
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver(),
  externalLink: makeExternalLinkDriver(),
  http: makeHTTPDriver(),
};

run(main, drivers);
