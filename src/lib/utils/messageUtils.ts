import { marked } from 'marked';

export function formatMessage(content: string) {
  try {
    return marked.parse(content, {
      breaks: true,
      gfm: true
    });
  } catch {
    return content;
  }
}
