import { permanentRedirect } from "next/navigation";

/**
 * `/agency` is the canonical "about us" page. The old `/about` route is kept
 * only so existing links and bookmarks resolve — it permanently redirects.
 */
export default function AboutPage() {
  permanentRedirect("/agency");
}
