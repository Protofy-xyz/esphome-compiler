import fs from "fs";
export async function createPath(path) {
    console.log("🤖 ~ createPath ~ path:", path)
    const resultPayload = await fs.mkdirSync(path)
    return resultPayload
}
