require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const port = process.env.PORT || 8000
const Connection = require("./server/database/conn");

// all Routes
const userRoute = require("./server/routes/users");
const authRoute = require("./server/routes/auth");
const postRoute = require("./server/routes/posts");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// restful apis
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// listenning port
app.listen(port, ()=>{ console.log(`Server is running at port ${port}`)});
