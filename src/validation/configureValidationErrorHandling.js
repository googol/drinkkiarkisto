export function configureValidationErrorHandling(app) {
  function handleValidationError(err, req, res, next) {
    if (err.name !== 'ValidationError') { return next(err); }
    if (!err.returnTo) { return next(err); }

    req.flash('error', err.message);
    req.flash('validationErrors', err.errorMessages);
    req.flash('invalidModel', err.model);
    res.redirect(err.returnTo);
  }

  app.use(handleValidationError);
}
