import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as MoodService from "./moods.service"
import { getLecture } from "../lectures/lectures.service"
import { getUser } from "../users/users.service"


function SocketMoodRouter(io: any) {

  const MoodRouter = express.Router()

  //GET: Mood from Lecture ID
  MoodRouter.get("/:lectureID", async (request: Request, response: Response) => {
    const lectureID: number = parseInt(request.params.lectureID, 10)
    try{
        const findlecture = await getLecture(lectureID)
        if (findlecture == null){
          return response.status(404).json("Invalid lecture ID.")
        }
        const aggregatedmoods = await MoodService.AggregateMoods(lectureID)
        return response.status(200).json(aggregatedmoods)
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })

  //GET: Mood from lecture ID and User ID.
  MoodRouter.get("/:lectureID/:userID", async (request: Request, response: Response) => {
    const lectureID: number = parseInt(request.params.lectureID, 10)
    const userID: number = parseInt(request.params.userID, 10)
    try{
        const finduser = await getUser(userID)
        const findlecture = await getLecture(lectureID)
        if (finduser == null) {
          return response.status(404).json("Invalid user ID.")
        }
        if (findlecture == null){
          return response.status(404).json("Invalid lecture ID.")
        }
        const mood = await MoodService.getMood(lectureID, userID)
        if (mood){ 
        return response.status(200).json(mood)
        } else {return response.status(200).json({user:userID, lecuter:lectureID, value:"Null"})}
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })


  //PUT: Update moods of Lecture ID and User ID.
  MoodRouter.put("/:lectureId/:userId", body("mood").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(500).json("JSON body is not provided in the correct format.")
    }
    if (!body("mood").isIn(["sad", "happy", "neutral"])){
        return response.status(500).json("Invalid mood value.")
    }
    const lectureId: number = parseInt(request.params.lectureId, 10)
    const userId: number = parseInt(request.params.userId, 10)
    try{
        const finduser = await getUser(userId)
        const findlecture = await getLecture(lectureId)
        if (finduser == null) {
          return response.status(404).json("Invalid user ID.")
        }
        if (findlecture == null){
          return response.status(404).json("Invalid lecture ID.")
        }
        const updated = await MoodService.updateMood(lectureId, userId, request.body)
        const moods = await MoodService.AggregateMoods(lectureId)
        io.emit("onAggregatedMoodChanges", moods)
        return response.status(200).json(updated)
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })

  return MoodRouter
}

module.exports = SocketMoodRouter
