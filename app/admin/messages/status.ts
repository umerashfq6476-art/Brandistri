/**
 * Message status helpers shared between the server actions and the client
 * components. Kept out of `actions.ts` because a "use server" module may only
 * export async functions.
 */

/**
 * The four states a message can be in, as shown in the inbox filter tabs and
 * the detail-page status dropdown. Derived from the `read`, `replied`, and
 * `archived` boolean columns.
 */
export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface MessageStatusFlags {
  read: boolean;
  replied: boolean;
  archived: boolean;
}

/** Collapse the boolean columns into a single status for display. */
export function deriveMessageStatus(flags: MessageStatusFlags): MessageStatus {
  if (flags.archived) return "archived";
  if (flags.replied) return "replied";
  if (flags.read) return "read";
  return "unread";
}
