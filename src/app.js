import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.route.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(
  express.json({
    limit: "40kb",
  })
);

app.use(
  express.urlencoded({
    limit: "40kb",
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Root Directory..!!!");
})

app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

app.use("/api/v1/user", userRoutes);

const start = async () => {
  const connectionDB = mongoose
    .connect(
      "mongodb+srv://maria:maria@cluster0.zjxj2xi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  // console.log(`Mongo Connected DB HOST ${connectionDB.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log(`App is listing at port http://localhost:${app.get("port")}`);
  });
};

start();
// console.log(process.env.mongoDB_URL);
