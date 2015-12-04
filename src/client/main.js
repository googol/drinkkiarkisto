import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import { Observable } from 'rx';
import { renderHeader } from '../views';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');

  const user = {
    isAdmin: true,
    email: 'admin@example.com',
    id: 1,
  };
  const locals = {
    user,
    query: '',
  };
  const view = Observable.just(locals).concat(Observable.never()).map(locals => renderHeader(locals.user, locals.query));

  return {
    DOM: view,
    externalLink: externalLinkClick$,
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#root'),
  externalLink: makeExternalLinkDriver(),
};

Cycle.run(main, drivers);
