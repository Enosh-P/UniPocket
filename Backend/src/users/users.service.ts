import { db } from "../utils/db.server"

type User = {
    id: number,
    name: string
}

export const getUser = async(id: number): Promise<User | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
        }
    })
}

export const createUser = async(username: Omit<User, "id">, userId: number): Promise<User> => {
    const { name } = username
    return db.user.create({
        data: {
            id: userId,
            name,
        },
        select: {
            id: true,
            name: true,
        }
    })
}
