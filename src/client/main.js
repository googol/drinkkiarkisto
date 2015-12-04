import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

function main(drivers) {
  // Some slight misuse of cyclejs, but nice for opening external links in different tab
  drivers.DOM.select('a[rel=external]')
    .events('click')
    .subscribe(event => {
      event.preventDefault();
      event.stopPropagation();
      window.open(event.target.href, '_blank');
    });

  return {
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#root'),
};

Cycle.run(main, drivers);
