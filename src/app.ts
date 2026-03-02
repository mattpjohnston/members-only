import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./config/passport.js";
import { pool } from "./db/pool.js";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import membershipRouter from "./routes/membership.js";
import messageRouter from "./routes/messages.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PostgresStore = connectPgSimple(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionSecret = process.env.SESSION_SECRET || "dev-only-secret";

app.use(
  session({
    secret: sessionSecret,
    store: new PostgresStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/membership", membershipRouter);
app.use("/messages", messageRouter);
app.use("/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).send("Not found");
});

export default app;
