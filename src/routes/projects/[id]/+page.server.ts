import { getDb } from "$lib/surreal"
import { jsonify, RecordId } from "surrealdb"
import type { Project } from "../../../schema/project"
import type { PageServerLoad } from "./$types"
import type { Vulnerability } from "../../../schema/vulnerability"

export const load: PageServerLoad = async ({ params }) => {
    const projectId = params.id
    const db = await getDb()
    return {
        project: db.select<Project>(new RecordId("project", projectId)).then((item) => jsonify(item)),
        vulnerabilities: db.query<[Vulnerability[]]>("SELECT id, date, ref, name, criticity, status, deadline, justification FROM vulnerability WHERE project=$pr ORDER BY date", { pr: new RecordId("project", projectId) })
            .then((item) => jsonify(item[0]))
    }
}