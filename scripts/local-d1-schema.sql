CREATE TABLE IF NOT EXISTS `reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `created_at` integer NOT NULL,
  `category` text NOT NULL,
  `urgency` text NOT NULL,
  `policy_id` text NOT NULL,
  `requires_approval` integer NOT NULL,
  `processing_time_ms` integer NOT NULL,
  `warning_count` integer NOT NULL,
  `model` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_reviews_created_at`
  ON `reviews` (`created_at`);
