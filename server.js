const express = require("express");
const dotenv = require("dotenv");
const UserRoutes = require("./routes/User.Routes");
const morgan = require("morgan");
require("./config/Db");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());

app.use('/api/v1/user', UserRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
