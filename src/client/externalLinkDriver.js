export default function makeExternalLinkDriver() {
  return function(input$) {
    input$.subscribe(event => {
      event.preventDefault();
      event.stopPropagation();
      window.open(event.target.href, '_blank');
    });
  };
}
