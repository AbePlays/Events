const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch((e) => {
      throw e;
    });
};

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((e) => {
      throw e;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then((res) => {
        return res.map((event) => {
          return {
            ...event._doc,
            _id: event._doc._id.toString(),
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f82fb9710f1b716678bcf33",
    });
    let createdEvent;
    return event
      .save()
      .then((res) => {
        createdEvent = {
          ...res._doc,
          _id: res._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, res._doc.creator),
        };
        return User.findById("5f82fb9710f1b716678bcf33");
      })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((res) => {
        return createdEvent;
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email }).then((user) => {
      if (user) {
        throw new Error("User already exists");
      } else {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user
              .save()
              .then((res) => {
                return { ...res._doc, password: null, _id: res.id };
              })
              .catch((e) => {
                console.log(e);
                throw e;
              });
          })
          .catch((e) => {
            console.log(e);
            throw e;
          });
      }
    });
  },
};
