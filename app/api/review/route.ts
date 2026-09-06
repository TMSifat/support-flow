import { reviewSupportTicket } from '@/lib/support-engine';
import { logReview } from '@/db/review-log';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Request body must be valid JSON.', code: 'INVALID_JSON' },
      { status: 400 },
    );
  }

  const message =
    typeof body === 'object' && body !== null && 'message' in body
      ? (body as { message?: unknown }).message
      : null;

  if (typeof message !== 'string' || !message.trim()) {
    return Response.json(
      { error: 'Message is required.', code: 'MESSAGE_REQUIRED' },
      { status: 400 },
    );
  }

  if (message.length > 5000) {
    return Response.json(
      {
        error: 'Message must be 5,000 characters or fewer.',
        code: 'MESSAGE_TOO_LONG',
      },
      { status: 400 },
    );
  }

  try {
    const result = await reviewSupportTicket(message.trim());
    let auditStatus: 'recorded' | 'unavailable' = 'recorded';
    try {
      await logReview({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        category: result.category,
        urgency: result.urgency,
        policyId: result.policy_matches[0]?.id ?? 'none',
        requiresApproval: result.requires_human_approval,
        processingTimeMs: result.processing_time_ms,
        warningCount: result.validation_warnings.length,
        model: result.model,
      });
    } catch (logError) {
      auditStatus = 'unavailable';
      console.warn(
        'Review completed, but the audit log was unavailable:',
        logError instanceof Error ? logError.message : 'unknown log error',
      );
    }
    return Response.json({ ...result, audit_status: auditStatus });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : 'Unknown model error';
    console.error('Ticket review failed:', detail);
    return Response.json(
      {
        error: 'The local model is unavailable. Check Ollama and try again.',
        code: 'MODEL_UNAVAILABLE',
      },
      { status: 503 },
    );
  }
}
