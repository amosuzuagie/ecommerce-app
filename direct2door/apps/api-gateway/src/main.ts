import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";

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

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Applying Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //num of minuts par request
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many request, Please try again later!" },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip, //Specifying the IP for rateLimit to track
});

app.use(limiter);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

const port = process.env.PORT || 8080;

// Set Auth Service to API Gateway
app.use("/", proxy("http://localhost:6001"));


const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on("error", console.error);
