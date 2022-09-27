import express from "express";
import {logout, getEdit, postEdit, see, startGithubLogin, callbackGithubLogin, getChangePassword, postChangePassword, userProfile} from "../controllers/usersController"
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const usersRouter = express.Router();

usersRouter.get("/logout", logout);
usersRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
usersRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/callback", publicOnlyMiddleware, callbackGithubLogin);
usersRouter.get("/:id", userProfile);
//usersRouter.get(":id", see);

export default usersRouter;