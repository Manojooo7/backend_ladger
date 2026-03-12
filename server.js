require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/config/db")
const port = process.env.PORT || 3000

connectToDb()

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
})