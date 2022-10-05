import Video from "../models/Video.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { async } from "regenerator-runtime";



export const home = async(req, res) => {
    const videos = await Video.find({}).populate("owner").sort({createdAt:"desc"});
    return res.render("home", {pageTitle: "Home", videos});
}
export const watch = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(!video){
        return res.render("404",{pageTitle: "video not found😵"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle:'Upload Video'})
}

export const postUpload = async (req, res) => {
    const {
        session: {
            user: {_id}
        },
        files: {
            video, thumb
        },
        body: {title, description, hashtags}
     } = req;

    try{
        const newVideo = await Video.create({
            title,
            description,
            videoUrl: video[0].location,
            thumbUrl: thumb[0].location,
            owner:_id,
            hashtags: Video.formatHashtags(hashtags)
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/")
    } catch(error) {
        return res.render("upload", {
            pageTitle:'Upload Video',
            errorMessage: error._message
        });
    }
}
export const getEdit = async(req, res) => {
    const { id } = req.params;
    const {
        user: {_id}
     } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle: "video not found😵"});
    }
    if(String(video.owner) !== String(_id)){
        req.flash("error","Not authorized");
        return res.status(403).redirect('/');
    }
    return res.render("edit", {pageTitle:`Editing ${video.title}`,video});
}
export const postEdit = async(req, res) => {
    const { id } = req.params;
    const { 
        user: { _id }
    } = req.session;
    const video = await Video.exists({ _id: id });
    const { title, description, hashtags } = req.body;
    if(!video){
        return res.status(404).render("404",{pageTitle: "video not found😵"});
    }
    if(String(video.owner) !== String(_id)){
        req.flash("error","Not authorized");
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    })

    return res.redirect(`../${id}`);
}

export const getDelete = async(req, res) => {
    const { id } = req.params;
    const {
        user: { _id }
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle: "video not found😵"});
    }
    if(String(video.owner) !== String(_id)){
        req.flash("error","Not authorized");
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }).populate('owner');
    }
    return res.render("search",{pageTitle:"Search🔎",videos})
}

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }

    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async(req, res) => {
    const {
        session: {user},
        params: {id},
        body: {text}
    } = req;

    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id
    });
    video.comments.push(comment._id);
    video.save();

    return res.sendStatus(201);
}