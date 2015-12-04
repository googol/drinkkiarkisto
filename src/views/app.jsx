/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

function renderAlert(type, content) {
  return <div className={ `alert alert-${type}` } role="alert">{ content }</div>;
}

function renderFlashes(successes, errors) {
  const successAlerts = successes && successes.length && successes.map(success => renderAlert('success', success)) || [];
  const errorAlerts = errors && errors.length && errors.map(error => renderAlert('danger', error)) || [];

  const allAlerts = successAlerts.concat(errorAlerts);

  if (allAlerts.length > 0) {
    return allAlerts;
  }
}

export function renderApp(header, pageContent, successes, errors) {
  return (
    <div>
      { header }
      <div className="container">
        { renderFlashes(successes, errors) }
        { pageContent }
      </div>
    </div>
  );
}
