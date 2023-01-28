import { db } from "../utils/db.server"

type Lecture = {
    id: number,
    name: string,
    description: string | null,
}

export const listLectures = async (): Promise<Lecture []> => {
    return db.lecture.findMany({
        select: {
            id: true,
            name: true,
            description: true,
        }
    })
}

export const getLecture = async(id: number): Promise<Lecture | null> => {
    return db.lecture.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            description: true,
        }
    })
}

export const createLecture = async(name: string, description: string): Promise<Lecture> => {
    return db.lecture.create({
        data: {
            name,
            description,
        },
        select: {
            id: true,
            name: true,
            description: true,
        }
    })
}

export const deleteLecture = async (id: number): Promise<Lecture | null> => {
    const lectureFound = await db.lecture.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    })
    if (!lectureFound) {
        return null
    }
    await db.lecture.delete({
      where: {
        id,
      }
      })
    return lectureFound
  }

export const resetLecture = async (id: number): Promise<Lecture | null> => {
    // update question to inactive
    await db.question.updateMany({
      where: {
        lecture: id
      },
      data: {
        isActive: false
      }
    })
    // delete mood
    await db.mood.deleteMany({
        where: {
          lecture: id
        }
    })
    //return updated lecture
    return db.lecture.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            description: true,
        }
    })
  }