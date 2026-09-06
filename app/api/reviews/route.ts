import { listRecentReviews } from '@/db/review-log';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get('limit') ?? 20);
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 20;

  try {
    const result = await listRecentReviews(limit);
    const reviews = (result.results ?? []).map((review) => ({
      ...review,
      requiresApproval: Boolean(review.requiresApproval),
    }));
    return Response.json({ reviews });
  } catch {
    return Response.json(
      {
        error:
          'Audit history is unavailable until the database migration is applied.',
      },
      { status: 503 },
    );
  }
}
