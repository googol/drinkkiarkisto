/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

export function renderDrink(drink, user) {
  return (
    <div>
      <h1>
        <a href={ `/drinks/${drink.id}/` }>{ drink.primaryName }</a>
        { renderAdminButtons(drink, user) }
        { renderNotAcceptedIcon(drink, user) }
      </h1>
      { renderWriterInfo(drink, user) }
      { renderAdditionalDrinkNames(drink) }
      <div className="row">
        <div className="col-md-6">
          <p>
            <strong>{ drink.type.name }</strong><br/>
            { drink.preparation }
          </p>
        </div>
        <div className="col-md-6">
          <ul>
            { drink.ingredients.map(ingredient => <li>{ `${formatAmount(ingredient.amount)} ${ingredient.name}` }</li>) }
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatAmount(amount) {
  if (amount % 1000 === 0) {
    return `${amount / 1000}  l`;
  } else if (amount % 100 === 0) {
    return `${amount / 100} dl`;
  } else if (amount % 10 === 0) {
    return `${amount / 10} cl`;
  } else {
    return `${amount} ml`;
  }
}

function renderAcceptDrinkButton(drink) {
  if (!drink.accepted) {
    return (
      <form className="btn-group" action={ `/drinks/${drink.id}/` } method="post">
        <button name="accept" value="true" type="submit" className="btn btn-primary btn-xs">
          <span className="glyphicon glyphicon-ok" />
        </button>
      </form>
    );
  }
}

function renderAdminButtons(drink, user) {
  if (user && user.isAdmin) {
    return (
      <div className="btn-group">
        { renderAcceptDrinkButton(drink) }
        <a href={ `/drinks/${drink.id}/?edit` } className="btn btn-default btn-xs">
          <span className="glyphicon glyphicon-pencil" />
        </a>
        <form className="btn-group" action={ `/drinks/${drink.id}/?_method=delete` } method="post">
          <button type="submit" className="btn btn-default btn-xs">
            <span className="glyphicon glyphicon-remove" />
          </button>
        </form>
      </div>
    );
  }
}

function renderNotAcceptedIcon(drink, user) {
  if (!drink.accepted && (!user || !user.isAdmin)) {
    return (
      <small>
        <span title="Tätä drinkkiä ei ole vielä hyväksytty!" className="glyphicon glyphicon-alert" aria-hidden="true" />
        <span className="sr-only">Tätä drinkkiä ei ole vielä hyväksytty!</span>
      </small>
    );
  }
}

function renderWriterInfo(drink, user) {
  if (user && user.isAdmin) {
    const statusString = drink.writer.active ? '' : ' (deleted)';
    return <em>{ `${drink.writer.email}${statusString}` }</em>;
  }
}

function renderAdditionalDrinkNames(drink) {
  if (drink.additionalNames && drink.additionalNames.length > 0) {
    return <small>{ `Tunnetaan myös ${drink.additionalNames.length === 1 ? 'nimellä' : 'nimillä'}: ${drink.additionalNames.join(', ')}` }</small>;
  }
}
