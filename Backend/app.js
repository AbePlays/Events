const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Event = require("./models/event");
const User = require("./models/user");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

mongoose
  .connect(
    `mongodb+srv://Abe:test123@cluster0.aphy7.mongodb.net/events?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server available at port 3000");
    });
  })
  .catch((e) => console.log(e));

app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id : ID!
            title : String!
            description : String!
            price : Float!
            date : String!
        }

        type User {
            _id : ID!
            email : String!
            password : String
        }

        input EventInput {
            title : String!
            description : String!
            price : Float!
            date : String!
        }

        input UserInput {
            email : String!
            password : String!
        }

        type RootQuery {
            events : [Event!]!
        }

        type RootMutation {
            createEvent(eventInput : EventInput) : Event
            createUser(userInput : UserInput) : User
        }

        schema {
            query : RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((res) => {
            return res.map((event) => {
              return { ...event._doc, _id: event._doc._id.toString() };
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
            createdEvent = { ...res._doc, _id: res._doc._id.toString() };
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
    },
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Yo");
});
