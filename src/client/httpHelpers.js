export const request = {
  drinks: {
    all: () => createGet('/'),
    single: drinkId => createGet(`/drinks/${drinkId}`),
    update: (drinkId, drink) => createPut(`/drinks/${drinkId}`, drinkToFields(drink)),
    new: drink => createPost('/', drink),
    delete: drinkId => createDelete(`/drinks/${drinkId}`),
  },
  users: {
    profile: () => createGet('/profile'),
    all: () => createGet('/users'),
    setAdminStatus: (userId, isAdmin) => createPost(`/users/${userId}/`, { setAdmin: isAdmin ? 'true' : 'false' }),
    updatePassword: (currentPassword, newPassword, newPasswordConfirm) => createPost(`/profile`, { currentPassword, newPassword, newPasswordConfirm, changePassword: 'true' }),
    new: (email, password, passwordConfirm) => createPost('/register', { email, password, passwordConfirm }),
    delete: userId => createDelete(`/users/${userId}/`),
    deleteSelf: () => createDelete('/profile'),
  },
  ingredients: {
    all: () => createGet('/ingredients'),
    new: ingredientName => createPost('/ingredients', { ingredientName }),
    delete: ingredientId => createDelete(`/ingredients/${ingredientId}/`),
  },
  drinkTypes: {
    all: () => createGet('/drinktypes'),
    new: drinkTypeName => createPost('/drinktypes', { drinkTypeName }),
    delete: drinkTypeId => createDelete(`/drinktypes/${drinkTypeId}/`),
  },
};

function createRequest(method, url, fields) {
  return { url, method, fields, accept: 'application/json' };
}

function createGet(url) {
  return createRequest('GET', url);
}

function createPost(url, fields) {
  return createRequest('POST', url, fields);
}

function createPut(url, fields) {
  return createRequest('PUT', url, fields);
}

function createDelete(url) {
  return createRequest('DELETE', url);
}

function drinkToFields(drink) {
  const fields = {
    drinkPreparation: drink.preparation,
    drinkName: drink.primaryName,
    additionalNames: drink.additionalNames.join('\n'),
    drinkType: drink.type.id,
  };

  for (const ingredient of drink.ingredients) {
    fields[`ingredient-${ingredient.id}-amount`] = ingredient.amount;
  }

  return fields;
}

export function getReceive(http) {
  function receive(method, url) {
    return http.filter(response$ => response$.request.method === method && response$.request.url === url);
  }

  function receiveGet(url) {
    return receive('GET', url);
  }

  function receivePost(url) {
    return receive('POST', url);
  }

  function receivePut(url) {
    return receive('PUT', url);
  }

  function receiveDelete(url) {
    return receive('DELETE', url);
  }

  return {
    drinks: {
      all: () => receiveGet('/'),
      single: drinkId => receiveGet(`/drinks/${drinkId}`),
      update: drinkId => receivePut(`/drinks/${drinkId}`),
      new: () => receivePost('/'),
      delete: drinkId => receiveDelete(`/drinks/${drinkId}`),
    },
    users: {
      profile: () => receiveGet('/profile'),
      all: () => receiveGet('/users'),
      setAdminStatus: userId => receivePost(`/users/${userId}/`),
      updatePassword: () => receivePost(`/profile`),
      new: () => receivePost('/register'),
      delete: userId => receiveDelete(`/users/${userId}/`),
      deleteSelf: () => receiveDelete('/profile'),
    },
    ingredients: {
      all: () => receiveGet('/ingredients'),
      new: ingredientName => receivePost('/ingredients'),
      delete: ingredientId => receiveDelete(`/ingredients/${ingredientId}/`),
    },
    drinkTypes: {
      all: () => receiveGet('/drinktypes'),
      new: () => receivePost('/drinktypes'),
      delete: drinkTypeId => receiveDelete(`/drinktypes/${drinkTypeId}/`),
    },
    any: http,
  };
}
