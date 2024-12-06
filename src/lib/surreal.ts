import Surreal from "surrealdb"
import {
    PUBLIC_DB_ENDPOINT,
    PUBLIC_DB_NS,
    PUBLIC_DB_DB,
} from "$env/static/public"
import {
	DB_USER,
	DB_PASSWORD
} from "$env/static/private"

type DbConfig = {
    url: string;
    namespace: string;
    database: string;
	user: string;
	password: string;
}

const DEFAULT_CONFIG: DbConfig = {
    url: PUBLIC_DB_ENDPOINT,
    namespace: PUBLIC_DB_NS,
    database: PUBLIC_DB_DB,
	user: DB_USER,
	password: DB_PASSWORD
}

let connectionPromise: Promise<Surreal> | null = null;

const connectToDatabase = async (config: DbConfig): Promise<Surreal> => {
	const db = new Surreal();

	try {
		await db.connect(config.url, {namespace: config.namespace, database: config.database});
        await db.signin({username: config.user, password: config.password});
        
		return db;
	} catch (err) {
		console.error(
			"Failed to connect to SurrealDB:",
			err instanceof Error ? err.message : String(err),
		);
		await db.close();
		throw err;
	}
};

export const getDb = async (
	config: DbConfig = DEFAULT_CONFIG,
): Promise<Surreal> => {
	if (!connectionPromise) {
		connectionPromise = connectToDatabase(config);
	}

	return connectionPromise;
};