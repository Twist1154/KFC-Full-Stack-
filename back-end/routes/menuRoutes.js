import express from "express";
import { getMenuItems } from "../controllers/menuController.js";

const router = express.Router();

router.get("/menu", getMenuItems);

export default router;
