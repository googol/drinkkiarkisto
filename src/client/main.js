import 'babel-polyfill';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import { Observable } from 'rx';
import { renderHeader, renderDrinkForm, renderApp } from '../views';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');

  const drink$ = Observable.just(
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
    }
  );
  const user$ = Observable.just({
    isAdmin: true,
    email: 'admin@example.com',
    id: 1,
  });
  const drinkTypes$ = Observable.just([
    { id: 1, name: 'shotti' },
    { id: 2, name: 'cocktail' },
    { id: 3, name: 'booli' },
  ]);
  const ingredients$ = Observable.just([
        { id: 1, name: 'Vodka', amount: 60 },
        { id: 2, name: 'Gin' },
        { id: 3, name: 'Dry vermouth', amount: 10 },
        { id: 4, name: 'Karpalomehu' },
        { id: 5, name: 'Schweppes Russchian' },
        { id: 6, name: 'Karpalolikööri' },
  ]);
  const query$ = Observable.just('');
  const successes$ = Observable.just([]);
  const errors$ = Observable.just([]);

  const model$ = Observable.combineLatest(
    user$,
    query$,
    drink$,
    drinkTypes$,
    ingredients$,
    (user, query, drink, drinkTypes, ingredients) => ({ user, query, drink, drinkTypes, ingredients }));

  const header$ = model$.map(locals => renderHeader(locals.user, locals.query));
  const drinkView$ = model$.map(locals => renderDrinkForm(`Muokkaa drinkkiä: ${locals.drink.name}`, `/drinks/${locals.drink.id}/`, 'delete', locals.drink, locals.drinkTypes, locals.ingredients));

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
