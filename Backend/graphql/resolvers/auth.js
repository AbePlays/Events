const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const ExistingUser = await User.findOne({ email: args.userInput.email });
      if (ExistingUser) {
        throw new Error("User already exists");
      } else {
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });

        const result = await user.save();

        return { ...result._doc, password: null, _id: result.id };
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        "somesecret",
        { expiresIn: "1h" }
      );

      return { userId: user.id, token, tokenExpiration: 1 };
    } catch (e) {
      throw e;
    }
  },
};
