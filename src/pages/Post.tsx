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

import { useEffect, useState } from 'react';

export default function Post() {
  const [post, setPost] = useState<any>(null);
  const styles = useStyles();

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

  if (!post) return null;

  return (
    <div className={styles.article}>
      <Title2>{post.title}</Title2>
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
      <div style={{ marginTop: tokens.spacingVerticalM }} dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}