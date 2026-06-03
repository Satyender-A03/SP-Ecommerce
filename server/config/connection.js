const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  })
  .catch((err) => {
    console.log(err);
  });
