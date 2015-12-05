/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { formatMethod, formatAction } from './helpers';

export function renderProfile(user) {
  return (
    <div>
      <h1>Profiilisi</h1>
      <p>{ `Sähköpostiosoite: ${user.email}` }</p>
      { user.isAdmin && <p>Sinulla on ylläpito-oikeudet.</p> }
      <div className="col-xs-4">
        <form action="/profile" method="post">
          <div className="form-group">
            <label htmlFor="passwordCurrent">Salasana</label>
            <input type="password" id="passwordCurrent" name="passwordCurrent" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="passwordNew">Uusi salasana</label>
            <input type="password" id="passwordNew" name="passwordNew" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="passwordNewConfirm">Vahvista uusi salasana</label>
            <input type="password" id="passwordNewConfirm" name="passwordNewConfirm" className="form-control" />
          </div>
          <button name="changePassword" value="true" className="btn btn-default">Vaihda salasana</button>
        </form>
      </div>
      <form action={ formatAction('/profile') } method={ formatMethod('post') }>
        <button className="btn btn-danger">Poista profiili</button>
      </form>
    </div>
  );
}
