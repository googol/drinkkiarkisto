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
  return DOM.select('a')
    .events('click')
    .do(event => { event.preventDefault(); event.stopPropagation(); })
    .map(event => event.target.href);
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
