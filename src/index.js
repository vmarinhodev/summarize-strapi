'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Getting all the users permission routes
    const userRoutes = 
    strapi.plugins["users-permissions"].routes["content-api"].routes;

    // Set the UUID for our middleware
    const isUserOwnerMiddleware = "global::user-find-many";
    const isUserCanUpdateMiddleware = "global::user-can-update";

    // Find the route where we want to inject the middleware
    const findUser = userRoutes.findIndex(
      (route) => route.handler === "user.find" && route.method === "GET"
    );

    // Find the route where we want to inject the update middleware
    const updateUser = userRoutes.findIndex(
      (route) => route.handler === "user.update" && route.method === "PUT"
    );

    // helper function that will add the required keys and set them accordingly
    function initializeRoute(routes, index) {
      routes[index].config.middlewares = routes[index].config.middlewares || [];
      routes[index].config.policies = routes[index].config.policies || [];
    }

    // Check if we found the one route if so push our middleware on to that route
    if (findUser) {
      initializeRoute(userRoutes, findUser);
      userRoutes[findUser].config.middlewares.push(isUserOwnerMiddleware);
    }

    if (updateUser) {
      initializeRoute(userRoutes, updateUser);
      userRoutes[updateUser].config.middlewares.push(isUserCanUpdateMiddleware);
    }

    // Should see the console log of our modified route
    // console.log(userRoutes[findUser], "userRoutes[findUser]");
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
