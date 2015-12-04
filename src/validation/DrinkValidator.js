import Promise from 'bluebird';
import { ValidationError } from './ValidationError';

export class DrinkValidator {
  validate(drink, returnTo) {
    return Promise.try(() => {
      const errorMessages = {};

      if (!drink.primaryName) {
        errorMessages.primaryName = 'Drinkin nimi ei saa olla tyhjä.';
      }
      if (!drink.preparation) {
        errorMessages.preparation = 'Drinkin valmistusohje ei saa olla tyhjä.';
      }
      if (!drink.type || !drink.type.id) {
        errorMessages.type = 'Drinkin tyyppi tulee määrittää.';
      }

      if (drink.ingredients) {
        const ingredientErrors = {};

        drink.ingredients.forEach(ingredient => {
          if (!ingredient.id) {
            ingredientErrors.general = 'Kaikkien ainesosien id tulee määritellä';
          } else if (!Number.isInteger(ingredient.amount) || (ingredient.amount < 0)) {
            ingredientErrors[ingredient.id] = 'Ainesosan määrän tulee olla positiivinen kokonaisluku.';
          }
        });

        if (Object.keys(ingredientErrors).length > 0) {
          errorMessages.ingredients = ingredientErrors;
        }
      }

      if (Object.keys(errorMessages).length > 0) {
        throw new ValidationError(drink, errorMessages, returnTo);
      }
    });
  }
}
