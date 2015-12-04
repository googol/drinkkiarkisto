import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM }) {
  const externalLinkClick$ = DOM.select('a[rel=external]').events('click');

  return {
    externalLink: externalLinkClick$,
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#root'),
  externalLink: makeExternalLinkDriver(),
};

Cycle.run(main, drivers);
