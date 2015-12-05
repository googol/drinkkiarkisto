/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

export function renderRegistration() {
  return (
    <div>
      <h1>Rekisteröidy drinkkiarkiston käyttäjäksi</h1>
      <div className="col-xs-4">
        <form action="/register" method="post">
          <div className="form-group">
            <label htmlFor="email">Sähköpostiosoite</label>
            <input type="email" id="email" name="email" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input type="password" id="password" name="password" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">Vahvista salasana</label>
            <input type="password" id="passwordConfirm" name="passwordConfirm" className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">Rekisteröidy</button>
          <a className="btn btn-link" href="/">Peruuta</a>
        </form>
      </div>
    </div>
  );
}
