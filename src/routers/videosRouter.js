import express from "express";
import { see, edit, remove, upload } from "../controllers/videoController";

const videosRouter = express.Router();

videosRouter.get("/upload" , upload);
videosRouter.get("/:id", see);
videosRouter.get("/:id/edit", edit);
videosRouter.get("/:id/remove", remove);

export default videosRouter;