import express from "express";
import {
  createUrlHandler,
  redirectHandler,
  statsHandler,
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/shorturls", createUrlHandler);
router.get("/:shortcode", redirectHandler);
router.get("/shorturls/:shortcode", statsHandler);

export default router;
