import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import switchPath from 'switch-path';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM, history }) {
  return {
    externalLink: getExternalLinkClicks(DOM),
    history: getInternalLinkClicks(DOM),
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
};

run(main, drivers);
