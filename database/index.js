/* @make connection to the database */
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const dbURI = process.env.MONGO_URI;
getConnection = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log(`Connection to DB successful!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

getConnection();

module.exports = mongoose.connection;
