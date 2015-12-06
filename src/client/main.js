import 'babel-polyfill';
import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver, filterLinks } from '@cycle/history';
import { Observable } from 'rx';
import switchPath from 'switch-path';
import makeExternalLinkDriver from './externalLinkDriver';

function main({ DOM, history }) {
  const navigationIntent = navigationIntents(history);

  const navigateTo$ = Observable.merge(
    getInternalLinkClicks(DOM),
    navigationIntent.redirectTo$.map(param => param.path));

  return {
    externalLink: getExternalLinkClicks(DOM),
    history: navigateTo$,
  };
}

function navigationIntents(history) {
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

  const route$ = history
    .map(location => switchPath(location.pathname, {
      '/': createRoute(routes.drinkList),
      '/drinks': {
        '/': () => location.query.edit && createRoute(routes.drinkNew) || createRoute(routes.redirectTo, { path: '/' }),
        '/:drinkId': drinkId => location.query.edit && createRoute(routes.drinkEdit, { drinkId }) || createRoute(routes.drinkSingle, { drinkId }),
      },
      '/ingredients': createRoute(routes.ingredientList),
      '/drinkTypes': createRoute(routes.drinkTypeList),
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

function getExternalLinkClicks(DOM) {
  return getLinkClicks(DOM)
    .do(event => { event.preventDefault(); event.stopPropagation(); })
    .map(event => event.target.href);
}

function getInternalLinkClicks(DOM) {
  return getLinkClicks(DOM)
    .filter(filterLinks)
    .map(event => event.target.pathname);
}

function getLinkClicks(DOM) {
  return DOM.select('a[rel=external]').events('click');
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver(),
  externalLink: makeExternalLinkDriver(),
};

run(main, drivers);
