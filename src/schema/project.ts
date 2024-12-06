import { record } from "$lib/zod";
import z from "zod";

export const Project = z.object({
	id: record("project"),
	name: z.string()
});

export type Project = z.infer<typeof Project>;