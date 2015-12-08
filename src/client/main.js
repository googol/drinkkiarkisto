import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import { makeHTTPDriver } from '@cycle/http';
import { Observable } from 'rx';
import makeExternalLinkDriver from './externalLinkDriver';
import { getView } from '../views';
import { request, getReceive } from './httpHelpers';
import { navigationIntents } from './intent';
import { getModel } from './model';

function main({ DOM, history, http }) {
  const receive = getReceive(http);

  const navigationIntent = navigationIntents(history);
  const model = getModel(navigationIntent, receive);

  const view$ = getView(model);

  const navigateTo$ = Observable.merge(
    getInternalLinkClicks(DOM),
    model.redirectTo$);

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
    .filter(event => event.target.rel === 'external')
    .do(event => { event.preventDefault(); event.stopPropagation(); })
    .map(event => event.target.href);
}

function getInternalLinkClicks(DOM) {
  return getLinkClicks(DOM)
    .filter(filterLinks)
    .map(event => event.target.pathname);
}

function getLinkClicks(DOM) {
  return DOM.select('a').events('click');
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver(),
  externalLink: makeExternalLinkDriver(),
  http: makeHTTPDriver(),
};

run(main, drivers);
