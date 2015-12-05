/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

export function renderLogin() {
  return (
    <div>
      <h1>Kirjaudu sisään</h1>
      <form action="/login" method="post" className="form-horizontal">
        <div className="form-group">
          <label htmlFor="username" className="col-sm-2 control-label">Sähköpostiosoite</label>
          <div className="col-sm-8">
            <input type="text" required className="form-control" id="username" name="username" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="col-sm-2 control-label">Salasana</label>
          <div className="col-sm-8">
            <input type="password" required className="form-control" id="password" name="password" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Kirjaudu sisään</button>
        <a className="btn btn-link" href="/">Peruuta</a>
      </form>
    </div>
  );
}
