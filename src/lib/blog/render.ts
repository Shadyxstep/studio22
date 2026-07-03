import { marked } from "marked";

// Markdown rendering (SPEC §15.5): server-side via marked. Raw HTML in the
// source is escaped — the author is the owner, but the rule costs nothing.

marked.use({
  async: false,
  gfm: true,
  breaks: false,
});

/** Render post markdown to HTML with raw HTML disabled (escaped as text). */
export function renderMarkdown(bodyMd: string): string {
  // marked keeps raw HTML by default; walkTokens lets us neutralise it.
  const tokens = marked.lexer(bodyMd);
  const walk = (list: { type?: string; text?: string; tokens?: unknown }[]) => {
    for (const token of list) {
      if (token.type === "html" && typeof token.text === "string") {
        token.type = "text";
        token.text = token.text
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      }
      if (Array.isArray((token as { tokens?: unknown }).tokens)) {
        walk((token as { tokens: typeof list }).tokens);
      }
    }
  };
  walk(tokens as unknown as { type?: string; text?: string }[]);
  return marked.parser(tokens);
}
