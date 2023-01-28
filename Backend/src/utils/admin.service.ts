import { db } from "../utils/db.server"

export const getSecret = async (user: string, pass: string): Promise<string | null> => {
    const userfound = await db.authenticator.findUnique({
        where: {
            user,
        },
        select: {
            user: true,
            pass: true,
            secret: true
        }
    })
    if (userfound != null && userfound.pass == pass) { return userfound.secret }
    return null
}

export const compareSecret =async (strSecret: string): Promise<boolean> => {
    const adminSecret = await db.authenticator.findUnique({
        where: {
            user: "admin",
        },
        select: {
            secret: true
        }
    })
    if (adminSecret !=null && adminSecret.secret == strSecret) {
        return true
    }
    return false
}
