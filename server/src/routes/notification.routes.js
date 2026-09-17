import { Router } from "express";
import {
  listNotifications,
  getUnreadCountHandler,
  markAsRead,
} from "../controllers/notification.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.use(authenticateUser);

router.get("/", listNotifications);
router.get("/unread-count", getUnreadCountHandler);
router.post("/mark-read", markAsRead);

export default router;
