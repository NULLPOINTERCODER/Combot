import { Router } from "express";
import {
  adminListChangelogs,
  adminGetChangelog,
  adminCreateChangelog,
  adminUpdateChangelog,
  adminDeleteChangelog,
  adminPublishChangelog,
  adminUnpublishChangelog,
} from "../controllers/adminChangelog.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createChangelogValidator,
  updateChangelogValidator,
} from "../validators/changelog.validators.js";

const router = Router();

router.use(authenticateUser, requireAdmin); // every route below requires admin

router.get("/", adminListChangelogs);
router.post("/", createChangelogValidator, validateRequest, adminCreateChangelog);
router.get("/:id", adminGetChangelog);
router.put("/:id", updateChangelogValidator, validateRequest, adminUpdateChangelog);
router.delete("/:id", adminDeleteChangelog);
router.patch("/:id/publish", adminPublishChangelog);
router.patch("/:id/unpublish", adminUnpublishChangelog);

export default router;
