import express from "express";
const router = express.Router();
import clientController from "../Controllers/clientController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

router.put("/client/:id", authMiddleware,clientController.updateClient); //authMiddleware

export default router;
