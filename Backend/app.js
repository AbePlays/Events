const express = require("express");
const mongoose = require("mongoose");
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
const events = [];

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
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Yo");
});
