import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as VoteService from "./votes.service"
import { getQuestion } from "../questions/questions.service"
import { getUser } from "../users/users.service"

function SocketVoteRouter(io: any) {

  const VoteRouter = express.Router()

  //GET: Votes from Question ID
  VoteRouter.get("/:questionID", async (request: Request, response: Response) => {
    const questionID: number = parseInt(request.params.questionID, 10)
    try{
        const findquestion = await getQuestion(questionID)
        if (!findquestion){
          return response.status(404).json("Invalid question ID.")
        }
        const aggregatedVotes = await VoteService.AggregatedVotes(questionID)
        return response.status(200).json(aggregatedVotes)
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })

  //GET: Votes from Question ID and User ID.
  VoteRouter.get("/:questionID/:userID", async (request: Request, response: Response) => {
    const questionID: number = parseInt(request.params.questionID, 10)
    const userID: number = parseInt(request.params.userID, 10)
    try{
        const finduser = await getUser(userID)
        const findquestion = await getQuestion(questionID)
        if (!finduser) {
          return response.status(404).json("Invalid user ID.")
        }
        if (!findquestion){
          return response.status(404).json("Invalid question ID.")
        }
        const vote = await VoteService.getVote(questionID, userID)
        if (vote){ 
        return response.status(200).json(vote)}
        else {return response.status(200).json({user:userID, question:questionID, vote:0})}
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })


  //PUT: Update votes of Question ID and User ID.
  VoteRouter.put("/:questionId/:userId", body("vote").isInt(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(500).json("JSON body is not provided in the correct format.")
    }
    if (!body("vote").isIn([-1, 1])){
        return response.status(500).json("Invalid vote value.")
    }
    const questionId: number = parseInt(request.params.questionId, 10)
    const userId: number = parseInt(request.params.userId, 10)
    try{
        const finduser = await getUser(userId)
        const findquestion = await getQuestion(questionId)
        if (!finduser) {
          return response.status(404).json("Invalid user ID.")
        }
        if (!findquestion){
          return response.status(404).json("Invalid question ID.")
        }
        await VoteService.updateVotes(questionId, userId, request.body)
        const aggregateVotes = await VoteService.AggregatedVotes(questionId)
        let combinedVotes: any
        combinedVotes = findquestion
        combinedVotes.upVotes = aggregateVotes.upVotes
        combinedVotes.downVotes = aggregateVotes.downVotes
        io.emit("onQuestionVotesChange", combinedVotes)
        return response.status(200).json(aggregateVotes)
    } catch (error: any) {
        return response.status(500).json(error.message)
    }
  })

  return VoteRouter
}

module.exports = SocketVoteRouter