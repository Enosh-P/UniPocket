import { db } from "../utils/db.server"

type Mood = {
    value:string,
}

type InputMood = {
    mood: "happy" | "neutral" | "sad"
}

type AggregatedMood = {
    lecture: number,
    happy: number,
    neutral: number,
    sad: number
}

export const AggregateMoods = async (lectureId: number): Promise<AggregatedMood> => {
    const listmoods =  await db.mood.findMany({
        where: {
            lecture: lectureId,
        },
        select: {
            user: true,
            lecture: true,
            value: true
        }
    })
    let happy: number = 0
    let sad: number = 0
    let neutral: number = 0
    for (const mood of listmoods) {
        if (mood.value == "happy") { happy++ }
        else if (mood.value == "sad"){ sad++ }
        else {neutral++}
    }
    return {lecture: lectureId, happy: happy, neutral: neutral, sad: sad}
}

export const getMood = async (lectureId: number, userId: number): Promise<Mood|null> => {
    return db.mood.findFirst({
        where: {
            user: userId,
            lecture: lectureId,
        },
        select: {
            user: true,
            lecture: true,
            value: true
        }
    })
}


export const updateMood = async(lectureId: number, userId: number, moodinput: InputMood): Promise<Mood> => {
    const { mood } = moodinput
    const justUpdate = await db.mood.findFirst({
        where: {
            user: userId,
            lecture: lectureId,
        },
        select: {
            lecture: true,
            user: true,
            value: true,
        }
    })
    if (justUpdate){
        await db.mood.updateMany({
            where: {
                user: userId,
                lecture: lectureId,
            },
            data: {
                value: mood
            }
        })
        justUpdate.value = mood
        return justUpdate
    }
    return db.mood.create({
        data: {
            lecture: lectureId,
            user: userId,
            value: mood,
        },
        select: {
            lecture: true,
            user: true,
            value: true,
        }
    })

}