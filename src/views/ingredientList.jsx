/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { formatMethod, formatAction } from './helpers';

export function renderIngredientList(ingredients) {
  return (
    <div>
      <h1>Ainesosat</h1>
      <div className="row">
        <div className="col-xs-5">
          <form>
            <table className="table table-striped">
              <tr><th colSpan="2">Nimi</th></tr>
              {
                ingredients.map(ingredient =>
                  <tr>
                    <td>{ ingredient.name }</td>
                    <td>
                      { renderDeleteIngredientButton(ingredient) }
                    </td>
                  </tr>
                )
              }
              <tr>
                <td>
                  <input type="text" className="form-control" id="ingredientName" name="ingredientName" />
                </td>
                <td>
                  <button type="submit" className="btn btn-primary btn-block" formAction="/ingredients" formMethod="post">
                    Lisää uusi ainesosa
                  </button>
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

function renderDeleteIngredientButton(ingredient) {
  if (!ingredient.used) {
    return (
      <button
        type="submit"
        className="btn btn-danger btn-block"
        formAction={ formatAction(`/ingredients/${ingredient.id}/`) }
        formMethod={ formatMethod('delete') }>
        Poista
      </button>
    );
  }
}
