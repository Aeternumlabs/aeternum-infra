import postgres, { type Sql } from "postgres";

export function createDbClient(databaseUrl: string): Sql {
  return postgres(databaseUrl);
}

export type { Sql };
