import { body, param } from "express-validator";

const TYPES = ["heart", "celebrate", "rocket"];

export const reactValidator = [
  param("id").isMongoId().withMessage("Invalid changelog id"),
  body("type").isIn(TYPES).withMessage("Reaction type must be heart, celebrate or rocket"),
];

export const removeReactionValidator = [
  param("id").isMongoId().withMessage("Invalid changelog id"),
  param("type").isIn(TYPES).withMessage("Reaction type must be heart, celebrate or rocket"),
];
