import mongoose from "mongoose";
import { ROLE } from "../../utils/enums.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Email from "./Email.model.js";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: "Your email is required",
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      required: "Your username is required",
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      trim: true,
      min: 6,
    },
    role: { type: String, enum: ROLE, default: ROLE.BUYER, required: true },
    publicKey: { type: String, unique: true, trim: true, required: false },
    data: {
      type: Object,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Convert Password to hash before save
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Check password is correct or not
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// generate JWT token
userSchema.methods.generateJWT = function () {
  let payload = {
    id: this._id,
    publicKey: this.publicKey,
    role: this.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Generate email verfication token
userSchema.methods.generateEmailVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new Email(payload);
};

// Generate token and expire time for password reset
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const User = mongoose.model("User", userSchema);

export default User;
