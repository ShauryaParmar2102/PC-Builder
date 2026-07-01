import express from "express";
import { PCListController } from "../public/controllers/PCListController.mjs";

const PCRoutes = express.Router();

PCRoutes.get("/list", PCListController.viewPCList);

export default PCRoutes;