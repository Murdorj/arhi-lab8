import express from "express";

import cors from "cors";
import { json } from "body-parser";
import router from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(json());

app.use("/api", router); 

export default app;
