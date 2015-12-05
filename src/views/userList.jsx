/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { formatMethod, formatAction } from './helpers';

export function renderUserList(users, currentUser) {
  return (
    <div>
      <h1>Käyttäjät</h1>
      <div className="row">
        <div className="col-xs-5">
          <form>
            <table className="table table-striped">
              <tr><th colSpan="3">Nimi</th></tr>
              {
                users.filter(user => user.active).map(user =>
                  <tr>
                    <td>{ user.email }</td>
                    <td>
                      { renderChangeUserRoleButton(user) }
                    </td>
                    <td>
                      {
                        (user.email !== currentUser.email) && (
                          <button
                            type="submit"
                            className="btn btn-danger btn-block"
                            formAction={ formatAction(`/users/${user.id}/`, 'delete') }
                            formMethod={ formatMethod('delete') }>
                            Poista
                          </button>
                        )
                      }
                    </td>
                  </tr>
                )
              }
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

function renderChangeUserRoleButton(user, currentUser) {
  if (user.isAdmin && user.email !== currentUser.email) {
    return (
      <button
        name="setAdmin"
        value="false"
        type="submit"
        className="btn btn-default btn-block"
        formAction={ `/users/${user.id}/` }
        formMethod="post">
        Poista ylläpito-oikeudet
      </button>
    );
  } else if (!user.isAdmin) {
    return (
      <button
        name="setAdmin"
        value="true"
        type="submit"
        className="btn btn-warning btn-block"
        formAction={ `/users/${user.id}/` }
        formMethod="post">
        Anna ylläpito-oikeus
      </button>
    );
  }
}
