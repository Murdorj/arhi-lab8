import dotenv from "dotenv";
dotenv.config();

import { connect } from "./database";
import app from "./app";

const port = process.env.PORT || 8080;

connect();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
