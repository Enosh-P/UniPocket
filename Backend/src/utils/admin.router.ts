import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import {getSecret} from "./admin.service"

export const AdminRouter = express.Router()

// POST: Create an Admin
// Params: name, pass
AdminRouter.post(
  "/", 
  body("user").isString(), 
  body("pass").isString(), 
  async (request: Request, response: Response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(500).json("JSON body is not provided in the correct format.")
      }
      try {
        const { user, pass } = request.body
        const secret = await getSecret(user, pass)
        if (secret){
          return response.status(200).json({secret: secret})
        }
        return response.status(403).json('Invalid username or password.')
      } catch (error: any) {
        return response.status(500).json(error.message);
      }
    }
  )