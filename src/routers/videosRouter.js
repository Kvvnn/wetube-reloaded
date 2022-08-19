import express from "express";
import { see, edit, remove, upload } from "../controllers/videoController";

const videosRouter = express.Router();

videosRouter.get("/upload" , upload);
videosRouter.get("/:id(\\d+)", see);
videosRouter.get("/:id(\\d+)/edit", edit);
videosRouter.get("/:id(\\d+)/remove", remove);

export default videosRouter;