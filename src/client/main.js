import 'babel-polyfill';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import { Observable } from 'rx';
import { renderHeader, renderDrinkList, renderApp } from '../views';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');

  const drink$ = Observable.just([
    {
      id: 3,
      primaryName: 'Vodka martini',
      preparation: 'Kaada ainesosat sekoituslasiin jossa on jäitä. Sekoita hyvin. Siivilöi jäähdytettyyn martinilasiin. Koristele oliivilla.',
      type: {
        id: 2,
        name: 'Cocktail',
      },
      writer: {
        id: 1,
        email: 'admin@example.com',
        active: true,
        isAdmin: true,
      },
      accepted: true,
      ingredients: [
        { id: 1, name: 'Vodka', amount: 60 },
        { id: 3, name: 'Dry vermouth', amount: 10 },
      ],
      additionalNames: [],
    },
  ]);
  const user$ = Observable.just({
    isAdmin: true,
    email: 'admin@example.com',
    id: 1,
  });
  const query$ = Observable.just('');
  const successes$ = Observable.just([]);
  const errors$ = Observable.just([]);

  const model$ = Observable.combineLatest(
    user$,
    query$,
    drink$,
    (user, query, drink) => ({ user, query, drink }));

  const header$ = model$.map(locals => renderHeader(locals.user, locals.query));
  const drinkView$ = model$.map(locals => renderDrinkList(locals.drink, locals.user));

  const view$ = Observable.combineLatest(header$, drinkView$, successes$, errors$, (header, drinkView, successes, errors) => renderApp(header, drinkView, successes, errors));

  return {
    DOM: view$,
    externalLink: externalLinkClick$,
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#root'),
  externalLink: makeExternalLinkDriver(),
};

Cycle.run(main, drivers);
