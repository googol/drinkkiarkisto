import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import switchPath from 'switch-path';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM, history }) {
  const externalLinkClick$ = DOM.select('a[rel=external]')
    .events('click')
    .do(event => { event.preventDefault(); event.stopPropagation(); })
    .map(event => event.target.href);

  const internalLinkClick$ = DOM.select('a').events('click').filter(filterLinks);

  return {
    externalLink: externalLinkClick$,
    history: internalLinkClick$,
  };
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver(),
  externalLink: makeExternalLinkDriver(),
};

run(main, drivers);
