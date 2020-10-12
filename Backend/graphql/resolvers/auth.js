const bcrypt = require("bcryptjs");
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
};
