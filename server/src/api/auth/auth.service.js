import StellarSdk from "stellar-sdk";
import fetch from "node-fetch";
import messages from "../../utils/messages.js";
import User from "../models/user.model.js";
const STELAR_API = "https://horizon-testnet.stellar.org";

var setllarServer = new StellarSdk.Server(STELAR_API);

export default {
  login: async (body) => {
    try {
      const { email, password } = body;
      const accountArray = [];

      // check account is exist or not
      const user = await User.findOne({ email });

      if (!user) {
        return {
          message: messages.INVALID_EMAIL_OR_PASSWORD,
        };
      }

      //validate password
      if (!user.comparePassword(password))
        return {
          message: messages.INVALID_EMAIL_OR_PASSWORD,
        };

      // Make sure the user has been verified
      //TODO
      // if (!user.isVerified)
      //   return {
      //     message: messages.ACCOUNT_NOT_VERIFIED,
      //   };

      // the JS SDK uses promises for most actions, such as retrieving an account

      const account = await setllarServer?.loadAccount(user.publicKey);

      account?.balances?.forEach(function (balance) {
        const account = {
          type: balance.asset_type,
          balance: balance.balance,
        };
        accountArray.push(account);
      });

      // Login successful, write token, and send back user
      const userData = {
        _id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        data: user?.data,
        username: user.username,
        publicKey: user.publicKey,
      };

      return {
        token: user.generateJWT(),
        user: userData,
      };
    } catch (error) {
      console.log(error);
      return {
        message: messages.INTERNAL_SERVER_ERROR,
      };
    }
  },

  createAccount: async (body) => {
    const { email, username } = body;

    //generate random keypair from stellar
    const pair = StellarSdk.Keypair.random();

    const credentials = {
      publicKey: pair.publicKey(),
      secretKey: pair.secret(),
    };

    if (body.role === "ADMIN")
      return {
        message: messages.ACCOUNT_NOT_VERIFIED,
      };

    try {
      // check email is exist or not
      const userByEmail = await User.findOne({ email });

      if (userByEmail) {
        return {
          message: messages.EMAIL_ALREADY_EXIST,
        };
      }

      // check username is exist or not
      const userByUsername = await User.findOne({ username });
      if (userByUsername) {
        return {
          message: messages.USERNAME_ALREADY_EXIST,
        };
      }

      const stellarResponse = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(
          pair.publicKey()
        )}`
      );

      const res = await stellarResponse.json();

      if (res) {
        body.publicKey = credentials.publicKey;

        //save object in mongo
        await new User({ ...body }).save();

        return { ...credentials };
      } else {
        return { message: messages.INTERNAL_SERVER_ERROR };
      }
    } catch (error) {
      console.log(error);
      return { message: messages.INTERNAL_SERVER_ERROR };
    }
  },
};
