import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as LectureService from "./lectures.service"
import { compareSecret } from "../utils/admin.service"

function SocketLectureRouter(io: any) {

    const lectureRouter = express.Router()

    //GET: List of all existing lectures.
    lectureRouter.get("/", async (request: Request, response: Response) => {
        try{
            const lectures = await LectureService.listLectures()
            return response.status(200).json(lectures)
        } catch (error: any) {
            return response.status(500).json(error.message)
        }
    })

    //GET: A single lecture by ID.
    lectureRouter.get("/:id", async (request: Request, response: Response) => {
        const id: number = parseInt(request.params.id, 10)
        try{
            const lecture = await LectureService.getLecture(id)
            return response.status(200).json(lecture)
        } catch (error: any) {
            return response.status(500).json(error.message)
        }
    })

    // PUT: reset a single lecture by lecture ID and secret
    lectureRouter.put("/:id/reset", body("secret").isString(), async (request: Request, response: Response) => {
        const errors = validationResult(request)
        const { secret } = request.body
        if (!errors.isEmpty() || !(await compareSecret(secret))) {
            return response.status(401).json("Authentication required")
        }
        const id: number = parseInt(request.params.id, 10)
        try{
            const lecture = await LectureService.resetLecture(id)
            if (lecture == null) {
                return response.status(404).json("Invalid lecture ID")
            }
            io.emit("onLectureReset", {lecture: id})
            return response.status(200).json(lecture)
        } catch (error: any) {
            return response.status(500).json(error.message)
        }
    })

    // DEL: DEL a single lecture by lecture ID and secret
    lectureRouter.delete("/:id", body("secret").isString(), async (request: Request, response: Response) => {
        const errors = validationResult(request)
        const { secret } = request.body
        if (!errors.isEmpty() || !(await compareSecret(secret))) {
            return response.status(401).json("Authentication required")
        }
        const id: number = parseInt(request.params.id, 10)
        try{
            const lecture = await LectureService.deleteLecture(id)
            if (lecture == null) {
                return response.status(404).json("Invalid lecture ID")
            }
            io.emit("onLectureDelete", lecture)
            return response.status(200).json(lecture)
        } catch (error: any) {
            return response.status(500).json(error.message)
        }
    })

    // POST: Create a Lecture
    // Params: name, description
    lectureRouter.post(
        "/",
        body("secret").isString(),
        body("name").isString(),
        async (request: Request, response: Response) => {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(500).json("JSON body is not provided in the correct format.")
            }
            try {
                const {secret, name, description} = request.body;
                if (!(await compareSecret(secret))){
                    return response.status(401).json("Authorization required.");
                }
                const newLecture = await LectureService.createLecture(name, description);
                io.emit("onLectureCreate", newLecture)
                return response.status(201).json(newLecture);
            } catch (error: any) {
                return response.status(500).json(error.message);
            }
        }
    )

  
  return lectureRouter;
}

module.exports = SocketLectureRouter