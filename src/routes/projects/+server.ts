import { getDb } from "$lib/surreal"

import type { RequestHandler } from "./$types"


export const POST: RequestHandler = async (params) => {
    const formData = await params.request.formData()
    const db = await getDb()
    await db.insert("project", { name: formData.get("project") })
    return new Response("", { status: 201 })
}