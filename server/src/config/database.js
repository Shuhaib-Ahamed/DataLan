import mongoose from "mongoose";
import User from "../api/models/user.model.js";
import { ROLE } from "../utils/enums.js";

function seedAdmin() {
  User.find({ username: "admin" }).then((users) => {
    if (users.length === 0) {
      let pwd = "admin123";
      let adminData = {
        username: "admin",
        email: "addmin@email.com",
        password: pwd,
        role: ROLE.ADMIN,
      };

      User.create(adminData).then((admin) => {
        console.log(`Seeded admin: ${admin.username}`);
      });
    }
  });
}

export default () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Database Connected!!"))
    .catch((err) => {
      console.log(err);
    });

  //Create admin
  seedAdmin();
};
