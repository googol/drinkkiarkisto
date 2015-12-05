import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM, history }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');
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
