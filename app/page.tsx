'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronRight,
  FileText,
  Inbox,
  LifeBuoy,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ReviewError, SupportReview } from '@/lib/support-contract';

const sampleTicket =
  'Hi, my order #4821 arrived with the wrong color. I need the blue one before Friday for a birthday. Can you replace it quickly?';

async function requestReview(message: string): Promise<SupportReview> {
  const response = await fetch('/api/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const payload = (await response.json()) as SupportReview | ReviewError;
  if (!response.ok || 'error' in payload) {
    throw new Error('error' in payload ? payload.error : 'Review failed.');
  }
  return payload;
}

export default function Home() {
  const [ticket, setTicket] = useState(sampleTicket);
  const [reply, setReply] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [review, setReview] = useState<SupportReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const requestVersion = useRef(0);

  async function reviewTicket(message = ticket) {
    const version = ++requestVersion.current;
    setIsRunning(true);
    setReview(null);
    setError(null);
    setApproved(false);
    setCopied(false);
    try {
      const result = await requestReview(message);
      if (version !== requestVersion.current) return;
      setReview(result);
      setReply(result.draft_reply);
      return result;
    } catch (caught) {
      if (version === requestVersion.current)
        setError(caught instanceof Error ? caught.message : 'Review failed.');
    } finally {
      if (version === requestVersion.current) setIsRunning(false);
    }
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(
      context.registerTool(
        {
          name: 'stage_support_ticket_review',
          title: 'Review support ticket',
          description:
            'Analyze one support message and stage the result in the visible review workspace.',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', minLength: 1, maxLength: 5000 },
            },
            required: ['message'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: true },
          async execute(input: unknown) {
            const message =
              typeof input === 'object' && input !== null && 'message' in input
                ? (input as { message?: unknown }).message
                : null;
            if (typeof message !== 'string' || !message.trim()) {
              throw new Error('Message is required.');
            }
            setTicket(message);
            const result = await reviewTicket(message);
            if (!result)
              throw new Error(
                'Review failed or was superseded by a newer ticket.',
              );
            return {
              category: result.category,
              urgency: result.urgency,
              requires_human_approval: result.requires_human_approval,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});

    return () => {
      lifecycle.abort();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#172033]">
      <header className="border-b border-[#e3e6eb] bg-white">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-[#172033] text-white">
              <LifeBuoy className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-[-0.02em]">
              SupportFlow
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-5 flex items-center gap-2 text-sm text-[#667085]">
          <Inbox className="size-4" aria-hidden="true" />
          <span>Inbox</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-[#172033]">New review</span>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-[#dfe3e9] bg-white shadow-[0_12px_35px_rgba(23,32,51,0.06)] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="border-b border-[#e5e7eb] p-5 sm:p-7 lg:border-r lg:border-b-0">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-[-0.025em]">
                  Support ticket review
                </h1>
                <p className="mt-1 text-sm text-[#667085]">
                  Pasted ticket · Local review
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#596579]">
                <span
                  className="size-2 rounded-full bg-[#98a2b3]"
                  aria-hidden="true"
                />
                <span>Open</span>
              </div>
            </div>

            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="ticket-message"
            >
              Customer message
            </label>
            <Textarea
              id="ticket-message"
              value={ticket}
              onChange={(event) => {
                requestVersion.current++;
                setIsRunning(false);
                setTicket(event.target.value);
                setReview(null);
                setError(null);
                setApproved(false);
                setCopied(false);
              }}
              className="min-h-56 resize-y border-[#dfe3e9] bg-white px-3 py-3 text-base leading-7 focus-visible:border-[#2463eb] focus-visible:ring-[#2463eb]/15"
            />

            <div className="mt-4 flex justify-end">
              <Button
                size="lg"
                onClick={() => reviewTicket()}
                disabled={!ticket.trim() || isRunning}
                className="h-10 bg-[#2463eb] px-4 text-white hover:bg-[#1d4ed8]"
              >
                {isRunning ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <FileText aria-hidden="true" />
                )}
                {isRunning ? 'Reviewing' : 'Review ticket'}
              </Button>
            </div>
          </section>

          <section
            className="bg-[#fbfcfd] p-5 sm:p-7"
            aria-live="polite"
            aria-busy={isRunning}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Review</h2>
              {review && (
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${
                    review.requires_human_approval
                      ? 'text-[#8a5a00]'
                      : 'text-[#19613a]'
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      review.requires_human_approval
                        ? 'bg-[#d99a1b]'
                        : 'bg-[#2f9d62]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>
                    {review.requires_human_approval
                      ? 'Approval required'
                      : 'Ready for review'}
                  </span>
                </div>
              )}
            </div>

            {isRunning ? (
              <div className="grid min-h-[390px] place-items-center">
                <Loader2
                  className="size-5 animate-spin text-[#667085]"
                  aria-label="Reviewing ticket"
                />
              </div>
            ) : review ? (
              <div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-[#e5e7eb] pb-6 sm:grid-cols-3">
                  <ReviewItem
                    label="Category"
                    value={review.category.replaceAll('_', ' ')}
                  />
                  <ReviewItem label="Priority" value={review.urgency} />
                  <ReviewItem
                    label="Policy"
                    value={review.policy_matches[0]?.id ?? 'None'}
                  />
                  <ReviewItem
                    label="Model estimate"
                    value={`${review.confidence}%`}
                  />
                  <ReviewItem
                    label="Audit log"
                    value={
                      review.audit_status === 'recorded'
                        ? 'Recorded'
                        : 'Unavailable'
                    }
                  />
                  <ReviewItem
                    label="Generation"
                    value={
                      review.generation_status === 'deterministic_fallback'
                        ? 'Safe fallback'
                        : 'Local model'
                    }
                  />
                </dl>

                <details className="my-4 rounded-xl border border-[#e2e6ec] bg-white p-4 text-sm leading-6">
                  <summary className="cursor-pointer font-medium">
                    Read matched policy
                  </summary>
                  <p className="mt-2">{review.policy_matches[0]?.content}</p>
                </details>
                <p className="mb-4 text-sm text-[#536074]">
                  Policy-template draft; personalize after checking the details.
                  The model estimate is not a measured probability of
                  correctness.
                </p>
                {(review.extracted_fields?.order_number ||
                  review.facts.length > 0) && (
                  <div className="mb-4 rounded-xl border border-[#e2e6ec] bg-white p-4">
                    <h3 className="text-sm font-semibold">
                      Provided in the message
                    </h3>
                    {review.extracted_fields?.order_number && (
                      <p className="mt-2 text-sm">
                        Order #{review.extracted_fields.order_number}
                      </p>
                    )}
                    {review.facts.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#536074]">
                        {review.facts.map((fact, index) => (
                          <li key={`${index}-${fact}`}>{fact}</li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-sm text-[#667085]">
                      Customer-provided details; verify them in the relevant
                      system.
                    </p>
                  </div>
                )}
                {error && (
                  <p role="alert" className="mb-4 text-sm text-[#8a2525]">
                    {error}
                  </p>
                )}

                {review.approval_reason && (
                  <div className="my-6 border-l-2 border-[#d99a1b] py-1 pl-4">
                    <p className="text-xs font-semibold tracking-[0.08em] text-[#8a5a00] uppercase">
                      Approval note
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#4b5565]">
                      {review.approval_reason}
                    </p>
                  </div>
                )}

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#e2e6ec] bg-white p-4">
                    <h3 className="text-sm font-semibold">
                      Recommended action
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#536074]">
                      {review.recommended_action}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e2e6ec] bg-white p-4">
                    <h3 className="text-sm font-semibold">Still to verify</h3>
                    <p className="mt-2 text-sm leading-6 text-[#536074]">
                      {review.missing_information.length
                        ? review.missing_information.join(', ')
                        : 'Verify the message and policy before use.'}
                    </p>
                  </div>
                </div>

                {review.validation_warnings.length > 0 && (
                  <div className="mb-6 rounded-xl border border-[#f3c8c8] bg-[#fff5f5] px-4 py-3">
                    <h3 className="text-sm font-semibold text-[#8a2525]">
                      Safety corrections applied
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#7a3838]">
                      {review.validation_warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <label
                  className="mb-2 block text-sm font-medium"
                  htmlFor="reply-draft"
                >
                  Reply draft
                </label>
                <Textarea
                  id="reply-draft"
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setApproved(false);
                    setCopied(false);
                  }}
                  className="min-h-48 resize-y border-[#dfe3e9] bg-white px-3 py-3 text-base leading-7 focus-visible:border-[#2463eb] focus-visible:ring-[#2463eb]/15"
                />

                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-10 border-[#d7dce3] bg-white px-4"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(reply);
                        setCopied(true);
                        setError(null);
                      } catch {
                        setCopied(false);
                        setError(
                          'Could not copy automatically. Select the reply text and copy it manually.',
                        );
                      }
                    }}
                    disabled={
                      !reply.trim() ||
                      (review.requires_human_approval && !approved)
                    }
                  >
                    {review.requires_human_approval && !approved
                      ? 'Approve before copy'
                      : copied
                        ? 'Copied'
                        : 'Copy draft'}
                  </Button>
                  <Button
                    className="h-10 bg-[#172033] px-4 text-white hover:bg-[#29344b]"
                    onClick={() => setApproved(true)}
                    disabled={approved || !reply.trim()}
                  >
                    <Check aria-hidden="true" />
                    {approved ? 'Approved' : 'Approve draft'}
                  </Button>
                </div>
                <p
                  className="mt-3 text-right text-sm text-[#667085]"
                  aria-live="polite"
                >
                  {approved
                    ? 'Approved by the operator. Sending remains outside SupportFlow.'
                    : 'Review or edit the draft before approving it.'}
                </p>
              </div>
            ) : (
              <div className="grid min-h-[390px] place-items-center text-center">
                <div>
                  <p className="font-medium">
                    {error ? 'Could not review ticket' : 'Ready to review'}
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {error ?? 'Select Review ticket to prepare a response.'}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.06em] text-[#7b8495]">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-[#172033]">{value}</dd>
    </div>
  );
}
