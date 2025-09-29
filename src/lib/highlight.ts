import hljs from 'highlight.js';

let currentTheme: HTMLLinkElement | null = null;

function setHighlightTheme(isDark: boolean) {
  const id = 'hljs-theme-style';
  if (currentTheme) currentTheme.remove();
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = id;
    document.head.appendChild(link);
  }
  link.href = isDark
    ? 'https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/github-dark.css'
    : 'https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/github.css';
  currentTheme = link;
}

export function highlightAllCodeBlocks(container: HTMLElement, isDark: boolean) {
  setHighlightTheme(isDark);
  if (!container) return;
  container.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement);
  });
}
