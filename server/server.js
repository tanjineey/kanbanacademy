const dotenv = require("dotenv");
//setting up config.env file variables
dotenv.config({ path: "config.env" });
const exp = require("express");
const crs = require("cors");
const bodyParser = require("body-parser");

const app = exp();

app.use(crs());
app.use(bodyParser.json());

app.listen(3001 || process.env.PORT, () =>
  console.log(`Your express server running lol or ${process.env.PORT} `)
);
app.use((req, res, next) => {
  console.log("req.path");

  try {
    console.log(req.path);
    decodeURIComponent(req.path);
  } catch (e) {
    console.log("req.path");

    return res.send({ code: 400 });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.send({ code: 400 });
  } else {
    next();
  }
});

//get routes
const router = require("./routes/authroute");
const a3router = require("./routes/authroutea3");
app.use(router);
app.use(a3router);

app.all("*", (req, res) => {
  res.json({
    code: 404,
    message: "Path does not exist",
  });
});
