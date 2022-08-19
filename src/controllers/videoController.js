export const recommended = (req, res) => res.render("home");

export const see = (req, res) => res.send(`See Video #${req.params.id}`);

export const edit = (req, res) => res.send(`Edit Video #${req.params.id}`);
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send(`Delte Video #${req.params.id}`);
