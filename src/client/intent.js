import switchPath from 'switch-path';

function createRoute(routeId, routeParam) {
  routeParam = routeParam || { };

  return [routeId, routeParam];
}

function getRouteIntent(route$, routeId) {
  const routeMatches = ({ value }) => value[0] === routeId;
  const returnParam = ({ value }) => value[1];

  return route$.filter(routeMatches).map(returnParam);
}

const routes = {
  drinkList: 'drinkList',
  drinkSingle: 'drink',
  drinkEdit: 'drinkEdit',
  drinkNew: 'drinkNew',
  ingredientList: 'ingredientList',
  drinkTypeList: 'drinkTypeList',
  userList: 'userList',
  registration: 'registration',
  login: 'login',
  profile: 'profile',
  redirectTo: 'redirectTo',
};

export function navigationIntents(history) {
  const route$ = history
    .map(location => switchPath(location.pathname, {
      '/': createRoute(routes.drinkList),
      '/drinks': {
        '/': () => location.query.edit && createRoute(routes.drinkNew) || createRoute(routes.redirectTo, { path: '/' }),
        '/:drinkId': drinkId => location.query.edit && createRoute(routes.drinkEdit, { drinkId }) || createRoute(routes.drinkSingle, { drinkId }),
      },
      '/ingredients': createRoute(routes.ingredientList),
      '/drinktypes': createRoute(routes.drinkTypeList),
      '/users': createRoute(routes.userList),
      '/register': createRoute(routes.registration),
      '/login': createRoute(routes.login),
      '/profile': createRoute(routes.profile),
    }));

  return {
    drinkList$: getRouteIntent(route$, routes.drinkList),
    drink$: getRouteIntent(route$, routes.drinkSingle),
    drinkEdit$: getRouteIntent(route$, routes.drinkEdit),
    drinkNew$: getRouteIntent(route$, routes.drinkNew),
    ingredientList$: getRouteIntent(route$, routes.ingredientList),
    drinkTypeList$: getRouteIntent(route$, routes.drinkTypeList),
    userList$: getRouteIntent(route$, routes.userList),
    registration$: getRouteIntent(route$, routes.registration),
    login$: getRouteIntent(route$, routes.login),
    profie$: getRouteIntent(route$, routes.profile),
    redirectTo$: getRouteIntent(route$, routes.redirectTo),
  };
}
