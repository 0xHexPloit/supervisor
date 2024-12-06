import { jsonify } from "surrealdb";
import { getDb } from "$lib/surreal";
import type { Project } from "../schema/project";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    const db = await getDb()
    const results = await db.query<Project[][]>("SELECT id, name, created_at FROM project ORDER BY created_at DESC")
    return {
        projects: jsonify(results[0])
    }
}