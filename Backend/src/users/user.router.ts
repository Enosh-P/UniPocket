import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as UserService from "./users.service"
import { getLecture } from "../lectures/lectures.service"
import { db } from "../utils/db.server"

type ChatResponse = {
  lecture: number,
  user: number,
  message: string
}


function SocketUserRouter(io: any) {
  
  const UserRouter = express.Router()

  //GET: A single User by ID.
  UserRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10)
    try{
        const user = await UserService.getUser(id)
        return response.status(200).json(user)
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })

  // POST: Create an User
  // Params: name
  UserRouter.post(
    "/",
    body("name").isString(),
    async (request: Request, response: Response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(500).json("JSON body is not provided in the correct format.")
      }
      try {
        let randID: number = 0
        let checkUser = Math.floor(Math.random()*100) + 1
        while (randID == 0) {
          if (await db.user.findUnique({
            where: {
              id: checkUser,
            },
            select: {
              id: true
            }
          })) {
            checkUser = Math.floor(Math.random()*100) + 1
          } else {
            randID = checkUser
          }
        }
        const newUser = await UserService.createUser(request.body, randID)
        return response.status(201).json(newUser);
      } catch (error: any) {
        return response.status(500).json(error.message);
      }
    }
  )

  // POST: Chat response
  // Params: name
  UserRouter.post(
    "/:userID/:lectureID/chat",
    body("message").isString(),
    async (request: Request, response: Response) => {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return response.status(500).json("JSON body is not provided in the correct format.")
      }
      try {
        const { message } = request.body;
        const userid: number = parseInt(request.params.userID, 10)
        const lectureid: number = parseInt(request.params.lectureID, 10)
        const finduser = await UserService.getUser(userid)
        const findlecture = await getLecture(lectureid)
        if (finduser == null) {
          return response.status(404).json("Invalid user ID.")
        }
        if (findlecture == null){
          return response.status(404).json("Invalid lecture ID.")
        }
        const currentTimestamp = new Date().toLocaleString();
        io.emit("onChatMessage", {user: {id: finduser.id, name: finduser.name}, message: message, lecture: lectureid, timestamp:currentTimestamp})
        const chatMsg: ChatResponse = {lecture: lectureid, user: userid, message:message}
        return response.status(201).json(chatMsg)
      } catch (error: any) {
        return response.status(500).json(error.message);
      }
    }
  )

  return UserRouter;
}

module.exports = SocketUserRouter