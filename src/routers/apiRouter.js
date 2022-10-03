import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/views", registerView);
apiRouter.post("/videos/:id/comment", createComment);

export default apiRouter;