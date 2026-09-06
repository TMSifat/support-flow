export const supportCategories = [
  'wrong_item',
  'return_refund',
  'shipping_delay',
  'order_change',
  'payment_security',
  'account_security',
  'product_information',
  'legal_safety',
  'complaint',
  'other',
] as const;

export const urgencyValues = ['normal', 'high', 'critical'] as const;

export type SupportCategory = (typeof supportCategories)[number];
export type Urgency = (typeof urgencyValues)[number];

export type SupportReviewRequest = {
  message: string;
};

export type SupportReview = {
  category: SupportCategory;
  urgency: Urgency;
  confidence: number;
  facts: string[];
  missing_information: string[];
  policy_matches: Array<{ id: string; title: string }>;
  recommended_action: string;
  requires_human_approval: boolean;
  approval_reason: string | null;
  draft_reply: string;
  validation_warnings: string[];
  processing_time_ms: number;
  model: string;
  generation_status: 'model' | 'deterministic_fallback';
  audit_status?: 'recorded' | 'unavailable';
};

export type ReviewErrorCode =
  | 'INVALID_JSON'
  | 'MESSAGE_REQUIRED'
  | 'MESSAGE_TOO_LONG'
  | 'REVIEW_FAILED';

export type ReviewError = {
  error: string;
  code: ReviewErrorCode;
};
