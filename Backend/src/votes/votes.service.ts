import { db } from "../utils/db.server"

type Vote = {
    vote: number
}

type InputVote = {
    vote: 1|-1
}

type CollectiveVotes = {
    question: number,
    upVotes: number,
    downVotes: number
}

// GET: Votes of the specified question ID and User ID
export const AggregatedVotes = async (questionId: number): Promise<CollectiveVotes> => {
    const listvotes = await db.vote.findMany({
        where: {
            question: questionId,
        },
        select: {
            user: true,
            question: true,
            vote: true
        }
    })
    let upVotes: number = 0
    let downVotes: number = 0
    for (const eachvote of listvotes) {
        if (eachvote.vote == -1) { downVotes++ }
        else if (eachvote.vote == 1) { upVotes++ }
    }
    return {question: questionId, upVotes: upVotes, downVotes: downVotes}
}

export const getVote = async (questionId: number, userId: number): Promise<Vote|null> => {
    return db.vote.findFirst({
        where: {
            user: userId,
            question: questionId,
        },
        select: {
            user: true,
            question: true,
            vote: true
        }
    })
}

// PUT: Update Vote based on question ID and User ID
export const updateVotes = async(questionId: number, userId: number, voteinput: InputVote): Promise<void> => {
    const { vote } = voteinput
    const justUpdate = await db.vote.findFirst({
        where: {
            user: userId,
            question: questionId,
        },
        select: {
            vote: true
        }
    })
    if (justUpdate) {
        await db.vote.updateMany({
            where: {
                user: userId,
                question: questionId,
            },
            data: {
                vote: vote
            }
        })
    } else {
        await db.vote.create({
            data: {
                question: questionId,
                user: userId,
                vote: vote,
            }
        })
    }

}