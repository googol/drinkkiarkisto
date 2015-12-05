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

  return {
    externalLink: externalLinkClick$,
    history: getInternalLinkClicks(DOM),
  };
}

function getInternalLinkClicks(DOM) {
  return DOM.select('a')
    .events('click')
    .filter(filterLinks)
    .map(event => event.target.pathname);
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver(),
  externalLink: makeExternalLinkDriver(),
};

run(main, drivers);
