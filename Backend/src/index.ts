import * as dotenv from "dotenv"
import express from "express"
import cors from "cors"
import http from 'http'

import { AdminRouter } from "./utils/admin.router"

dotenv.config()


if (!process.env.PORT) {
    process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const socketServer = require("socket.io")(httpServer, { cors: {}}) 

const SocketQuestionRouter = require("./questions/question.router")(socketServer)
const SocketMoodRouter = require("./moods/mood.router")(socketServer)
const SocketVoteRouter = require("./votes/vote.router")(socketServer)
const SocketUserRouter = require("./users/user.router")(socketServer)
const SocketLectureRouter = require("./lectures/lecture.router")(socketServer)

// API Routes
app.use(express.json())
app.use("/secret", AdminRouter)
app.use("/lectures", SocketLectureRouter)
app.use("/users", SocketUserRouter)
app.use("/questions", SocketQuestionRouter)
app.use("/votes", SocketVoteRouter)
app.use("/moods", SocketMoodRouter)

socketServer.on("connection", (socket: any) => {
    console.log("Socket Connection Established to a User")   //TODO: Send as msg to chat
})

httpServer.listen(PORT, () => {
    console.log('Listenning on port %d', PORT)
})
