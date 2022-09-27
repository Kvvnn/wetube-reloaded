import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";


/*const functionLogin = (user) => {
    req.session.loggedIn = true;
    req.session.user = user;
}*/

export const getJoin = (req, res) => res.render("join",{pageTitle:"Create Account"});

export const postJoin = async(req, res) => {
    const pageTitle = "Create Account";
    const {name, username, email, password, password2, location} = req.body;

    if(password !== password2){
        return res.status(400).render("join",{pageTitle, errorMessage:"Password confirmation is not matched"});
    };

    const exists = await User.exists({ $or: [{username},{email}] });
    if(exists){
        return res.status(400).render("join",{pageTitle, errorMessage:"This Username/email is already exist"})
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location
        });
    }catch{
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message 
        });
    }
    res.redirect("/login");
};

export const getLogin = (req, res) => res.render("login",{pageTitle : "Login"});

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username, socialOnly:false})
    if(!user){
        return res.status(400).render("login",
            {
            pageTitle,
            errorMessage:"This username does not exist"
            }
        );
    };

    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login",
            {
            pageTitle,
            errorMessage:"Wrong Password"
            }
        );
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id : process.env.GITHUB_CLIENT,
        scope : "read:user user:email",
        allow_signup : "false"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const callbackGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GITHUB_CLIENT,
        client_secret : process.env.GITHUB_SECRET,
        code : req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    const tokenRequest = await (
        await fetch(finalUrl,{
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await(
            await fetch(`${apiUrl}/user`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
            ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
            );
            if(!emailObj){
                return res.render("login",{pageTitle:"Login",errorMessage:"Can't bring your github email"});
            }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
                avaterUrl: userData.avater_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password:"",
                githubOnly: true,
                location: userData.location
            });
        };
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("login");
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("edit-profile",{pageTitle:"Edit Profile"});
};
export const postEdit =  async(req, res) => {
    const {
        session: {
            user: { _id, email:sessionEmail, username:sessionUsername, avatarUrl}
        },
        body: {name , email, username, location},
        file
    } = req;
    //베낀코드이므로 다시한번 확인해보기! -> search할 param을 비교해 array에 push하고, id를 비교하여 내 것이 맞는지 확인!
    let searchParam = [];
    if(sessionEmail!==email){
        searchParam.push({email});
    }
    if(sessionUsername!==username){
        searchParam.push({username});
    }
    if(searchParam.length>0){
        const findUser = await User.findOne({$or:searchParam});
        if(findUser && findUser.id.toString() !== _id) {
            return res.status(400).render("edit-profile", {
                pageTitle:"Edit Profile",
                errorMessage:"This username is already exists"
            });
        }
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location
    },
    {new: true}
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
    /*
    req.session.user = {
        ...req.session.user,
        name,
        email,
        username,
        location
    }*/
};
export const getChangePassword = (req, res) => {
    if(req.session.user.githubOnly === true){
        return res.redirect("/");
    }
    return res.render("change-password",{pageTitle:"Change Password"});
}
export const postChangePassword = async(req, res) => {
    
    const {
        session: {
            user: {_id}
        },
        body: {oldPassword, newPassword, newPassword2}
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok){
        return res.status(400).render("change-password",{pageTitle:"Change Password", errorMessage:"Current password is incorrect"});
    }
    if(newPassword !== newPassword2){
        return res.status(400).render("change-password",{pageTitle:"Change Password", errorMessage:"New Password confirmation is not matched"});
    }
    
    user.password = newPassword;
    user.save();
    req.flash("info","Password Changed!");
    return res.redirect("/users/logout");
    }

export const userProfile = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate("videos");
    if(!user){
        return res.status(404).render("404", {pageTitle: "User not found"})
    }
    return res.render("userProfile",{pageTitle: user.name, user})
}