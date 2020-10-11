const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (e) {
    throw e;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f830a6a063f6f19375d878d",
    });
    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById("5f830a6a063f6f19375d878d");
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
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
