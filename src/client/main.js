import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import { Observable } from 'rx';
import { renderHeader } from '../views';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');

  const user$ = Observable.just({
    isAdmin: true,
    email: 'admin@example.com',
    id: 1,
  });
  const query$ = Observable.just('');
  const model$ = Observable.combineLatest(user$, query$, (user, query) => ({ user, query }));

  const view$ = model$.map(locals => renderHeader(locals.user, locals.query));

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
