import type { Sql } from "postgres";

export type DueVault = {
  id: string;
  backupAddress: string;
  inactivityPeriod: bigint;
  lastActivityTimestamp: bigint;
};

export async function getDueVaults(
  sql: Sql,
  now: bigint,
): Promise<DueVault[]> {
  const rows = await sql`
    SELECT
      id,
      backup_address AS "backupAddress",
      inactivity_period AS "inactivityPeriod",
      last_activity_timestamp AS "lastActivityTimestamp"
    FROM vaults
    WHERE is_recovered = false
      AND is_abandoned = false
      AND last_activity_timestamp + inactivity_period <= ${now.toString()}
  `;

  return rows as unknown as DueVault[];
}
