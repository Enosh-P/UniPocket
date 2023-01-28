import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as QuestionService from "./questions.service"
import { getLecture } from "../lectures/lectures.service"
import { getUser } from "../users/users.service"
import { getVote } from "../votes/votes.service"
import { compareSecret } from "../utils/admin.service"

function SocketQuestionRouter(io: any) {
  
    const QuestionRouter = express.Router()
  
    //GET: Question from lecture ID.
    QuestionRouter.get("/:id", async (request: Request, response: Response) => {
      const id: number = parseInt(request.params.id, 10)
      try{
          const questions = await QuestionService.listQuestions(id)
          if (questions === undefined) {
              return response.status(404).json("Invalid lecture ID.")
          }
          return response.status(200).json(questions)
      } catch (error: any) {
          return response.status(500).json(error.message)
          }
    })

    // DEL: DEL a single question by question ID and secret
    QuestionRouter.delete("/:id", body("secret").isString(), async (request: Request, response: Response) => {
      if (!validationResult(request).isEmpty() || !(await compareSecret(request.body.secret))) {
        return response.status(401).json("Authentication required");
      }
      const id: number = parseInt(request.params.id, 10)
      const question = await QuestionService.deleteQuestion(id);

      if (!question) return response.status(404).json("Invalid question ID");

      io.emit("onQuestionRemoved", question);
      return response.status(200).json(question);
    })
  
  // POST: Export Question and Votes
  // Params: lectureID
  QuestionRouter.post("/:lectID/export", body("secret").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request)
    const { secret } = request.body
    if (!errors.isEmpty() || !(await compareSecret(secret))) {
      return response.status(401).json("Authentication required")
    }
    try {
      const lectID: number = parseInt(request.params.lectID, 10)
      const findlecture = await getLecture(lectID)
      if (findlecture == null){
        return response.status(404).json("Invalid lecture ID.")
      }
      const allQuestions = await QuestionService.listQuestions(lectID, false)
      let allVotes: any[] = []
      for (const question of allQuestions) {
        const vote = await getVote(question.id, question.author);
        if (vote) allVotes.push(vote);
      }
      return response.status(201).json({questions: allQuestions, votes: allVotes});
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
    }
  )
  
  // POST: Create a Question
  // Params: lectureID, UserID, question
  QuestionRouter.post(
    "/:lectID/:userID",
    body("question").isString(),
    async (request: Request, response: Response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(500).json("JSON body is not provided in the correct format.")
      }
      try {
        const question = request.body
        const lectID: number = parseInt(request.params.lectID, 10)
        const userID: number = parseInt(request.params.userID, 10)
        const finduser = await getUser(userID)
        const findlecture = await getLecture(lectID)
        if (finduser == null) {
          return response.status(404).json("Invalid user ID.")
        }
        if (findlecture == null){
          return response.status(404).json("Invalid lecture ID.")
        }
        const newQuestion = await QuestionService.createQuestion(lectID, userID, question)
        io.emit("onQuestionAdded", newQuestion)
        return response.status(201).json(newQuestion);
      } catch (error: any) {
        return response.status(500).json(error.message);
      }
    }
  ) 

    return QuestionRouter;
  }
  
module.exports = SocketQuestionRouter