export const recommended = (req, res) => res.render("home", {pageTitle: "Home"});

export const see = (req, res) => res.render("watch", {pageTitle: `Watch #${req.params.id}`, videoNum: `#${req.params.id}`});

export const edit = (req, res) => res.render("edit", {pageTitle: `Edit #${req.params.id}`, videoNum: `#${req.params.id}`});
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send(`Delte Video #${req.params.id}`);
