export default function makeExternalLinkDriver() {
  return function(input$) {
    input$.subscribe(url => {
      window.open(url, '_blank');
    });
  };
}
