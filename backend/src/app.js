import express from "express";
import cors from "cors";
import router from "./routes/urlRoutes.js";
import { requestLogger } from "./requestLogger.js";
import { Log } from "../../logging-middleware/index.js";

const app = express();
const port = 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(requestLogger);

app.use("/", router);

app.listen(port, async () => {
  await Log(
    "backend",
    "info",
    "server",
    `Server active on http://localhost:${port}`,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-token-here"
  );
});
