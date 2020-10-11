const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yo");
});

app.listen(3000, () => {
  console.log("Server available at port 3000");
});
