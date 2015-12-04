/** @jsx hJSX */
import { hJSX } from '@cycle/dom';

export function renderApp(header, pageContent) {
  return (
    <div>
      { header }
      <div className="container">
        { pageContent }
      </div>
    </div>
  );
}
