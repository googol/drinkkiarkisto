/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { renderDrink } from './drink';

export function renderDrinkList(drinks, user) {
  return (
    <div>
      <h1>Drinkkiarkisto</h1>
      <p className="lead">Löydä suosikkidrinkkisi!</p>
      { renderRows(drinks, user) }
      { renderNewDrinkButton(user) }
    </div>
  );
}

function renderRows(drinks, user) {
  if (drinks) {
    const drinkRows = Array.from(splitIntoGroupsOf(3, drinks));
    return drinkRows.map(drinkRow => (
      <div className="row">
        {
          drinkRow.map(drink => (
            <div className="col-xs-4">
              { renderDrink(drink, user) }
            </div>
          ))
        }
      </div>
    ));
  }
}

function* splitIntoGroupsOf(groupSize, array) {
  let currentGroup = [];
  for (const current of array) {
    const currentLength = currentGroup.push(current);

    if (currentLength === groupSize) {
      yield currentGroup;
      currentGroup = [];
    }
  }

  if (currentGroup.length > 0) {
    yield currentGroup;
  }
}

function renderNewDrinkButton(user) {
  if (user) {
    return <p><a href="/drinks/?new" className="btn btn-default btn-xs">Lisää uusi drinkki</a></p>;
  }
}
