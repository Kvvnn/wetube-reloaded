import express from "express";
import {add , remove} from "../controllers/commentsController.js"

const commentsRouter = express.Router();

commentsRouter.get("/add", add);
commentsRouter.get("/remove", remove);

export default commentsRouter;