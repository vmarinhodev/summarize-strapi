'use strict';

/**
 * `on-summary-create` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You are not authenticated");

    const availableCredits = user.credits;

    if (availableCredits === 0)
      return ctx.unauthorized("You do not have enough credits. ");

    await next();

    const uid = "plugin::users-permissions.user";
    const payload = {
      data: {
        credits: availableCredits - 1,
        summaries: {
          connect: [ctx.response.body.data.id],
        },
      },
    };

    try {
      await strapi.entityService.update(uid, user.id, payload);
    } catch (error) {
      ctx.badrequest("Error Updating User Credits");
    }

    // console.log("############## Inside middleware end ############")
  };
};
