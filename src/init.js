import "regenerator-runtime";
import "dotenv/config";
import "./db.js"
import "./models/Video.js"
import "./models/User.js"
import "./models/Comment.js"
import app from "./server.js"

const PORT = process.env.PORT || 4000;


const handleListening = () =>
console.log(`✅Server listening on port http://localhost:${PORT}📡`);

app.listen(PORT, handleListening);