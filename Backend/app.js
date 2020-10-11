const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/events");
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

        input EventInput {
            title : String!
            description : String!
            price : Float!
            date : String!
        }

        type RootQuery {
            events : [Event!]!
        }

        type RootMutation {
            createEvent(eventInput : EventInput) : Event
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
        });
        return event
          .save()
          .then((res) => {
            console.log(res);
            return { ...res._doc };
          })
          .catch((e) => {
            console.log(e);
            throw e;
          });
      },
    },
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Yo");
});
