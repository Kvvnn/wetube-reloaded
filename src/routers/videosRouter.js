import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, getDelete } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videosRouter = express.Router();

videosRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(videoUpload.fields([
        { name: "video" },
        { name: "thumb" }
        ]), postUpload);
videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videosRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(getDelete);


export default videosRouter;