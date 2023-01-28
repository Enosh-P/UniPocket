import { db } from "../utils/db.server"

type Question = {
    id: number,
    lecture: number
    author: number,
    textContent: string,
}

type InputQuestion = {
    question: string,
}

//single question
export const getQuestion =async (id: number): Promise<Question | null> => {

    const question = await db.question.findUnique({
        where:{
            id,
        },
        select:{
            id: true,
            lecture: true,
            author: true,
            textContent: true,
            timestamp: true,
            isActive: true,
        }
    })
    if (question?.isActive){
        let formattedQuestion: any
        formattedQuestion = question
        formattedQuestion.timestamp = question.timestamp.getTime()
        return formattedQuestion
    }
    return null
}


// GET: active questions of the specified lecture ID.
export const listQuestions = async (id: number, active: boolean = true): Promise<Question []> => {
    if (active){
        const questions = await db.question.findMany({
            where: {
                lecture: id,
                isActive: active
            },
            select: {
                id: true,
                lecture: true,
                author: true,
                textContent: true,
                timestamp: true,
                isActive: true,
            }
        })
        let formattedQuestions: any
        formattedQuestions = questions.map((question) => ({
            ...question,
            timestamp: question.timestamp.getTime()
        }))
        return formattedQuestions
    }else{
        const questions = await db.question.findMany({
            where: {
                lecture: id,
            },
            select: {
                id: true,
                lecture: true,
                author: true,
                textContent: true,
                timestamp: true,
                isActive: true,
            }
        })
        let formattedQuestions: any
        formattedQuestions = questions.map((question) => ({
            ...question,
            timestamp: question.timestamp.getTime()
        }))
        return formattedQuestions
    }
}

// POST: Creates the Questions given a question message and lecture id and user id
export const createQuestion = async(lectureId: number, authorId: number, inputquestion: InputQuestion): Promise<Question> => {
    const { question } = inputquestion
    const questionData = await db.question.create({
        data: {
            textContent: question,
            lecture: lectureId,
            author: authorId,
        },
        select: {
            id: true,
            lecture: true,
            author: true,
            textContent: true,
            timestamp: true,
            isActive: true,
        }
    })
    let formattedQuestion: any
    formattedQuestion = questionData
    formattedQuestion.timestamp = questionData.timestamp.getTime()
    return formattedQuestion
}

export const deleteQuestion = async (id: number): Promise<Question | null> => {
    const questionFound = await db.question.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            lecture: true,
            author: true,
            textContent: true,
            timestamp: true,
            isActive: true,
        }
    })
    if (!questionFound) {
        return null
    }
    await db.question.delete({
      where: {
        id,
      }
    })
    let formattedQuestion: any
    formattedQuestion = questionFound
    formattedQuestion.timestamp = questionFound.timestamp.getTime()
    return formattedQuestion
  }