const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.get("/", (req, res) => {
  res.send("root");
});

main()
  .then(() => {
    console.log(`database Connected`);
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/majoreProject");
}

let port = 8080;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
