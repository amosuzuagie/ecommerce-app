import cors from "cors";

import express from "express";
import * as path from "path";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to auth-service!" });
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on("error", (err) => {
  console.log("Server Error: ", err);
});
