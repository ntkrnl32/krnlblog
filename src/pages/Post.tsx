import { Title2, tokens, makeStyles } from '@fluentui/react-components';
import { getPostBySlug } from '../lib/content';

const useStyles = makeStyles({
  article: {
    maxWidth: '760px',
    margin: '0 auto',
    lineHeight: 1.8,
    fontSize: '16px',
    boxSizing: 'border-box',
    width: '100%',
    '@media (max-width: 900px)': {
      padding: tokens.spacingHorizontalM,
      fontSize: '15px',
    },
    '@media (max-width: 600px)': {
      padding: tokens.spacingHorizontalS,
      fontSize: '14px',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '0 auto',
    },
    '& pre': {
      overflowX: 'auto',
      padding: tokens.spacingHorizontalM,
      backgroundColor: tokens.colorNeutralBackground2,
      borderRadius: tokens.borderRadiusMedium,
      fontSize: '13px',
      wordBreak: 'break-all',
    },
    '& table': {
      width: '100%',
      display: 'block',
      overflowX: 'auto',
    },
  },
});

import { useEffect, useState, useRef } from 'react';
import { useMemo } from 'react';
import { highlightAllCodeBlocks } from '../lib/highlight';

export default function Post() {
  
  const [post, setPost] = useState<any>(null);
  const styles = useStyles();
  const articleRef = useRef<HTMLDivElement>(null);
  // 通过 window.localStorage 或 prefers-color-scheme 获取 isDark
  function getIsDark() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop() || '';
    const p = getPostBySlug(slug);
    setPost(p);
    // 设置页面标题
    if (p && p.title) {
      const blogName = document.title.split(' - ').pop() || '';
      document.title = `${p.title} - ${blogName}`;
    }
  }, []);

  // 生成目录和带锚点的 html
  const { toc, htmlWithAnchors } = useMemo(() => {
    if (!post?.html) return { toc: [], htmlWithAnchors: post?.html || '' };
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.html, 'text/html');
    const headings = Array.from(doc.body.querySelectorAll('h2, h3, h4'));
    const toc: { id: string; text: string; level: number }[] = [];
    headings.forEach((el, idx) => {
      let text = el.textContent || '';
      let id = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '') || `section-${idx}`;
      // 保证唯一
      let uniq = id, n = 1;
      while (doc.getElementById(uniq)) { uniq = id + '-' + (n++); }
      el.id = uniq;
      toc.push({ id: uniq, text, level: Number(el.tagName[1]) });
    });
    return { toc, htmlWithAnchors: doc.body.innerHTML };
  }, [post]);

  useEffect(() => {
    if (articleRef.current) {
      highlightAllCodeBlocks(articleRef.current, getIsDark());
    }
  }, [htmlWithAnchors]);

  if (!post) return null;

  return (
    <div className={styles.article} ref={articleRef}>
      <Title2>{post.title}</Title2>
      {toc.length > 0 && (
        <nav style={{ margin: '16px 0', padding: '8px 16px', background: tokens.colorNeutralBackground3, borderRadius: 8, fontSize: 15 }}>
          <b style={{ fontSize: 14, color: tokens.colorBrandForeground1 }}>目录：</b>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {toc.map(item => (
              <li key={item.id} style={{ marginLeft: (item.level - 2) * 16 }}>
                <a href={`#${item.id}`} style={{ color: tokens.colorBrandForeground2, textDecoration: 'underline', fontSize: 14 }}>{item.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {post.group && (
        <div style={{ marginTop: 8 }}>
          <a href={`/group/${encodeURIComponent(post.group)}`} style={{ color: tokens.colorBrandForeground1, fontSize: 14, textDecoration: 'underline' }}>分组：{post.group}</a>
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {post.tags.map((tag: string) => (
            <a key={tag} href={`/tag/${encodeURIComponent(tag)}`} style={{ color: tokens.colorBrandForeground2, fontSize: 13, background: tokens.colorNeutralBackground3, borderRadius: 4, padding: '1px 8px', textDecoration: 'none' }}>#{tag}</a>
          ))}
        </div>
      )}
      <div style={{ marginTop: tokens.spacingVerticalM }} dangerouslySetInnerHTML={{ __html: htmlWithAnchors }} />
    </div>
  );
}