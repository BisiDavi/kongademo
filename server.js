const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const dbConnection = require("./database");
const MongoStore = require("connect-mongo")(session);
const usePassport = require("./passport");
const flash = require("connect-flash");
const cors = require("cors");
const dotenv = require("dotenv");
const myAppRoutes = require("./routes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionStore = new MongoStore({
  mongooseConnection: dbConnection,
  collection: "sessions"
});
app.use(
  session({
    secret: "gentleman",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000
    }
  })
);

app.use(flash());

usePassport(app);

myAppRoutes(app);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on PORT: ${process.env.PORT || 4000}`);
});
