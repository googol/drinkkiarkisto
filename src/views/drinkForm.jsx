/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { formatAction, formatMethod } from './helpers';

export function renderDrinkForm(title, action, method, drink, drinkTypes, ingredients) {
  return (
    <div>
      <h1>{ title }</h1>
      <form action={ formatAction(action, method) } method={ formatMethod(method) } className="form-horizontal">
        <div className="form-group">
          <label htmlFor="drinkName" className="col-sm-2 control-label">Drinkin nimi</label>
          <div className="col-sm-8">
            <input type="text" required className="form-control" id="drinkName" name="drinkName" value={ drink && drink.primaryName } />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="drinkPreparation" className="col-sm-2 control-label">Valmistusohje</label>
          <div className="col-sm-8">
            <textarea rows="2" required className="form-control" id="drinkPreparation" name="drinkPreparation">
              { drink && drink.preparation }
            </textarea>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="additionalNames" className="col-sm-2 control-label">Muut nimet joilla drinkki tunnetaan</label>
          <div className="col-sm-8">
            <textarea rows="2" className="form-control" id="additionalNames" name="additionalNames" aria-describedby="additionalNamesHelp">{ drink && drink.additionalNames.join('\n') }</textarea>
            <span id="additionalNamesHelp" className="help-block">Syötä jokainen nimi omalle rivilleen</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="drinkType" className="col-sm-2 control-label">Tyyppi</label>
          <div className="col-sm-8">
            <select id="drinkType" name="drinkType" className="form-control">
              { renderDrinkTypeOptions(drinkTypes, drink) }
            </select>
          </div>
        </div>
        { renderIngredientAmountSelections(ingredients) }
        <button type="submit" className="btn btn-primary">Tallenna muutokset</button>
        <a className="btn btn-link" href="/drinks/<%= locals.drink.id %>/">Peruuta</a>
      </form>
    </div>
  );
}

function renderDrinkTypeOptions(drinkTypes, drink) {
  return drinkTypes.map(drinkType => <option value={ drinkType.id } selected={ drink && drink.type.id === drinkType.id }>{ drinkType.name }</option>);
}

function renderIngredientAmountSelections(ingredients) {
  if (ingredients && ingredients.length) {
    return ingredients.map(ingredient =>
      <div className="form-group">
        <label
          htmlFor={ `ingredient-${ingredient.id}-amount` }
          className="col-sm-2 control-label">
          { `Ainesosa: ${ingredient.name}` }
        </label>
        <div className="col-sm-8">
          <div className="input-group">
            <input
              type="number"
              min="0"
              id={ `ingredient-${ingredient.id}-amount` }
              name={ `ingredient-${ingredient.id}-amount` }
              className="form-control"
              aria-label={ `Ainesosan ${ingredient.name} määrä` }
              value={ ingredient.amount }
            />
            <span className="input-group-addon">ml</span>
          </div>
        </div>
      </div>
    );
  }
}
