const myAppRoutes = (_app) => {
_app.use("/api", require("../controllers/home"));
_app.use("/api", require("../controllers/products"));
_app.use("/api", require("../controllers/users"));
}

module.exports = myAppRoutes;
