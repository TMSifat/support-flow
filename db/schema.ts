import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const reviews = sqliteTable(
  'reviews',
  {
    id: text('id').primaryKey(),
    createdAt: integer('created_at').notNull(),
    category: text('category').notNull(),
    urgency: text('urgency').notNull(),
    policyId: text('policy_id').notNull(),
    requiresApproval: integer('requires_approval', {
      mode: 'boolean',
    }).notNull(),
    processingTimeMs: integer('processing_time_ms').notNull(),
    warningCount: integer('warning_count').notNull(),
    model: text('model').notNull(),
  },
  (table) => [index('idx_reviews_created_at').on(table.createdAt)],
);
