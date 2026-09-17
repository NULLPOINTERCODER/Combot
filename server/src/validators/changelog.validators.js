import { body, query } from "express-validator";

const CATEGORIES = ["New", "Improved", "Fixed"];
const STATUSES = ["Draft", "Published"];

export const createChangelogValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 150 }),
  body("category").isIn(CATEGORIES).withMessage("Category must be New, Improved or Fixed"),
  body("status").optional().isIn(STATUSES).withMessage("Status must be Draft or Published"),
  body("contentMarkdown").optional().isString(),
  body("coverImage").optional({ nullable: true }).isString(),
];

export const updateChangelogValidator = [
  body("title").optional().trim().isLength({ max: 150 }),
  body("category").optional().isIn(CATEGORIES),
  body("status").optional().isIn(STATUSES),
  body("contentMarkdown").optional().isString(),
  body("coverImage").optional({ nullable: true }).isString(),
];

export const listChangelogQueryValidator = [
  query("category").optional().isIn([...CATEGORIES, "All"]),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const searchQueryValidator = [
  query("q").trim().notEmpty().withMessage("Search query 'q' is required"),
];
