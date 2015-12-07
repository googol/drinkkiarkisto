/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

function getUserProfileLink(user) {
  if (user) {
    return <li><p className="navbar-text">Kirjautunut sisään käyttäjänä: <a href="/profile" className="navbar-link">{ user.email }</a></p></li>;
  } else {
    return <li><a href="/register">Rekisteröidy</a></li>;
  }
}

function getLoginButton(user) {
  if (user) {
    return <li><form action="/logout" method="post"><button className="btn btn-link navbar-btn">Kirjaudu ulos</button></form></li>;
  } else {
    return <li><a href="/login">Kirjaudu sisään</a></li>;
  }
}

function getAdminLinks(user) {
  if (user && user.isAdmin) {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/ingredients">Ainesosat</a></li>
        <li><a href="/drinktypes">Drinkkityypit</a></li>
        <li><a href="/users">Käyttäjät</a></li>
      </ul>
    );
  }
}

export function renderHeader(user, query) {
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a className="navbar-brand" href="/">Drinkkiarkisto</a>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><a rel="external" href="https://github.com/googol/drinkkiarkisto">Projektisivu</a></li>
            <li><a rel="external" href="doc/documentation.pdf">Dokumentaatio</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <form className="navbar-form" action="/" method="get">
                <div className="input-group">
                  <input className="form-control" type="search" placeholder="Etsi..." name="q" value={ query } aria-label="Hakukenttä" />
                  <span className="input-group-btn">
                    <button type="submit" className="btn btn-default">
                      <span className="sr-only">Etsi</span>
                      <span className="glyphicon glyphicon-search" aria-hide="true" />
                    </button>
                  </span>
                </div>
              </form>
            </li>
            { getUserProfileLink(user) }
            { getLoginButton(user) }
          </ul>
          { getAdminLinks(user) }
        </div>
      </div>
    </nav>
  );
}
