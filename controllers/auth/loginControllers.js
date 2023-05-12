// the logic to allow a user to log in

import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/Jwtservice.js";
import { REFRESH_SECRET } from "../../config/index.js";
import { User, RefreshToken } from "../../models/index.js";

const loginController = {
  async login(req, res, next) {
    // Creating a login schema
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    });

    const { error } = loginSchema.validate(req.body);

    // In case any error arises
    if (error) {
      return next(error);
    }

    // Validating the credentials provided by the user
    try {
      const user = await User.findOne({ email: req.body.email });
      // Checking if the email exists in the database or not
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Checking if the entered password is correct
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Generating user tokens
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

      await RefreshToken.create({ token: refresh_token });

      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    // Validating the token entered by the user
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    // In case any error arises
    if (error) {
      return next(error);
    }

    // If the entered token is genuine, proceed to delete it
    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong!"));
    }
    res.json({ status: 200 });
  },
};

export default loginController;
