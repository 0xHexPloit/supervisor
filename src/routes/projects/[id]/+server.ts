import { getDb } from "$lib/surreal";
import type { RequestHandler } from "@sveltejs/kit";
import { RecordId } from "surrealdb";
import XLSX from "xlsx"

export const DELETE: RequestHandler = async ({ params }) => {
    const projectId = params.id
    const db = await getDb();
    const record = new RecordId("project", projectId as string)
    await db.delete(record)
    await db.query("DELETE vulnerability WHERE project=$pr", { pr: record })
    return new Response("")
}

export const PATCH: RequestHandler = async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const workbook = XLSX.read(await file.arrayBuffer(), {type: "array"})
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    console.log(XLSX.utils.sheet_to_json(sheet))
    return new Response("")
}