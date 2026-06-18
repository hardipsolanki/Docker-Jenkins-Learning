import express from "express"
import path from "path"
import { fileURLToPath } from "url" 
const app = express()

const __filename = fileURLToPath(import.meta.url)  // current file path
const __dirname = path.dirname(__filename)  
app.use(express.static(path.join(__dirname, "../public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// app.get("/", (req, res) => {
//     return res.json({
//           message: "Hey there! I am inside node.js container"
//      })
// })


// routes
import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users", userRoutes)

export {app}