import { getD1 } from './index';

export type ReviewLog = {
  id: string;
  createdAt: number;
  category: string;
  urgency: string;
  policyId: string;
  requiresApproval: boolean;
  processingTimeMs: number;
  warningCount: number;
  model: string;
};

export async function logReview(record: ReviewLog) {
  const db = getD1();
  await db
    .prepare(
      `INSERT INTO reviews (
        id,
        created_at,
        category,
        urgency,
        policy_id,
        requires_approval,
        processing_time_ms,
        warning_count,
        model
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      record.id,
      record.createdAt,
      record.category,
      record.urgency,
      record.policyId,
      record.requiresApproval ? 1 : 0,
      record.processingTimeMs,
      record.warningCount,
      record.model,
    )
    .run();
}

export async function listRecentReviews(limit = 20) {
  const db = getD1();
  return db
    .prepare(
      `SELECT
        id,
        created_at AS createdAt,
        category,
        urgency,
        policy_id AS policyId,
        requires_approval AS requiresApproval,
        processing_time_ms AS processingTimeMs,
        warning_count AS warningCount,
        model
      FROM reviews
      ORDER BY created_at DESC
      LIMIT ?`,
    )
    .bind(Math.max(1, Math.min(limit, 100)))
    .all();
}
