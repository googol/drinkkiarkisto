/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { formatAction } from './helpers';

export function renderDrinkTypeList(drinkTypes) {
  return (
    <div>
      <h1>Drinkkityypit</h1>
      <div className="row">
        <div className="col-xs-5">
          <form>
            <table className="table table-striped">
              <tr><th colSpan="2">Nimi</th></tr>
              {
                drinkTypes.map(drinkType =>
                  <tr>
                    <td>{ drinkType.name }</td>
                    <td>
                      { renderDeleteButton(drinkType) }
                    </td>
                  </tr>
                )
              }
              <tr>
                <td>
                  <input type="text" className="form-control" id="drinkTypeName" name="drinkTypeName" />
                </td>
                <td>
                  <button type="submit" className="btn btn-primary btn-block" formAction="/drinktypes" formMethod="post">
                    Lisää uusi drinkkityyppi
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

function renderDeleteButton(drinkType) {
  if (!drinkType.used) {
    return (
      <button
        type="submit"
        className="btn btn-danger btn-block"
        formAction={ formatAction(`/drinktypes/${drinkType.id}/`, 'delete') }
        formMethod={ formatAction('delete') }>
        Poista
      </button>
    );
  }
}
