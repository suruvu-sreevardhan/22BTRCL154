import { Log } from "../../logging-middleware/index.js";

export async function requestLogger(req, res, next) {
  const { method, originalUrl } = req;
  const message = `${method} ${originalUrl}`;

  await Log(
    "backend",
    "info",
    "request",
    message,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-real-token-here"
  );

  next();
}
