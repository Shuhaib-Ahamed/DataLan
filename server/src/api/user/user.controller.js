import userService from "./user.service.js";

export default {
  getUser: async (req, res, next) => {
    try {
      return await userService.getUser(req, res);
    } catch (error) {
      return next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      return await userService.updateUser(req, res);
    } catch (error) {
      return next(error);
    }
  },

  updateUserByPublickey: async (req, res, next) => {
    try {
      return await userService.updateUserByPublickey(req, res);
    } catch (error) {
      return next(error);
    }
  },

  updateUserRole: async (req, res, next) => {
    try {
      return await userService.updateUserRole(req, res);
    } catch (error) {
      return next(error);
    }
  },
};
