// routes/agencyRoutes.js
import express from "express";
const router = express.Router();
import agencyController from "../controllers/agencyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

router.post("/register", agencyController.registerAgency);
router.post("/login", agencyController.loginAgency);

router.post(
  "/agency-client",
  authMiddleware,
  agencyController.createAgencyWithClient
); // authMiddleware,
// authMiddleware,
router.get("/top-client", authMiddleware, agencyController.getTopClient);

export default router;
