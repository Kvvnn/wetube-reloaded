import express from "express";
//import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import usersRouter from "./routers/usersRouter.js";
import videosRouter from "./routers/videosRouter.js";
import { localsMiddleware } from "./middlewares.js";
import apiRouter from "./routers/apiRouter.js";




const app = express();
//const logger = morgan("dev");
 
app.set("view engine","pug");
app.set("views", process.cwd() + "/src/views");
//app.use(logger);
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 10000000,
        },
        store: MongoStore.create({mongoUrl: process.env.DB_URL})
    })
);

app.use((req,res,next) => {
    res.header("Cross-Origin-Embedder-Policy","credentialless");
    res.header("Cross-Origin-Opener-Policy","same-origin");
    next();
});
    
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/videos", videosRouter);
app.use("/api", apiRouter);

export default app;



