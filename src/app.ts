import express from "express";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import membershipRouter from "./routes/membership.js";
import messageRouter from "./routes/messages.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/membership", membershipRouter);
app.use("/messages", messageRouter);
app.use("/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).send("Not found");
});

export default app;
