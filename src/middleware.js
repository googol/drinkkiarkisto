import methodOverride from 'method-override'

export function configureMiddleware(app) {
  app.use(methodOverride('_method'));
}
