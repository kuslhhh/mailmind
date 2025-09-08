import express from "express"
import authRouter from "./routes/auth"
import gmailRouter from "./routes/gmail"
import cors from "cors"
import "dotenv/config"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/auth", authRouter)
app.use("/gmail", gmailRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
   console.log(`Server running on port http://localhost:${PORT}`);
});