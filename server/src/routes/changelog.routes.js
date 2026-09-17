import { Router } from "express";
import {
  listPublicChangelogs,
  searchChangelogs,
  getPublicFeed,
  getChangelogBySlug,
} from "../controllers/changelog.controller.js";
import { setReaction, removeReaction } from "../controllers/reaction.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  listChangelogQueryValidator,
  searchQueryValidator,
} from "../validators/changelog.validators.js";
import { reactValidator, removeReactionValidator } from "../validators/reaction.validators.js";

const router = Router();

// Order matters: specific paths before the /:slug catch-all
router.get("/feed", getPublicFeed);
router.get("/search", searchQueryValidator, validateRequest, optionalAuth, searchChangelogs);
router.get("/", listChangelogQueryValidator, validateRequest, optionalAuth, listPublicChangelogs);

router.post("/:id/reactions", authenticateUser, reactValidator, validateRequest, setReaction);
router.delete(
  "/:id/reactions/:type",
  authenticateUser,
  removeReactionValidator,
  validateRequest,
  removeReaction
);

router.get("/:slug", optionalAuth, getChangelogBySlug);

export default router;
