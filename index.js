import express from "express";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import MongoStore from "connect-mongo";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import mongoose from "mongoose";

const app = express();

// Read allowed origins from environment variable and clean up spaces
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map(url => url.trim())
  .filter(Boolean); // remove empty strings just in case

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server requests

      // Check if origin matches any allowed origin
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Optional: allow all Vercel preview URLs automatically
      const vercelRegex = /^https:\/\/kambaz-next(-[a-z0-9]+)?-saulmanzs-projects\.vercel\.app$/;
      if (vercelRegex.test(origin)) {
        return callback(null, true);
      }

      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    },
  })
);

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    secure: process.env.SERVER_ENV === "production",
  },
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    collectionName: "sessions",
  }),
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
}

app.use(express.json());
app.use(session(sessionOptions));

Lab5(app);
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
