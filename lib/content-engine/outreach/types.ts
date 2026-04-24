export type OutreachStatus = "pending" | "approved" | "sent" | "failed" | "replied" | "link_acquired";

export type OutreachMessage = {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
  failedReason?: string;
  replyNote?: string;
  /** When a live backlink placement is confirmed (human-verified). */
  linkAcquiredUrl?: string;
  linkAcquiredAt?: string;
};

export type OutreachQueueFile = {
  updatedAt: string;
  /** YYYY-MM-DD for daily cap */
  sentDay: string;
  sentCount: number;
  messages: OutreachMessage[];
};
