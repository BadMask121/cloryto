import express from "express";
import { getEventData } from "../controllers/index";

const router = express.Router();

router.route("/").get(getEventData);

export default router;
