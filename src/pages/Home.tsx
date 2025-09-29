import { Card, Title3, Subtitle2, Body1, tokens, makeStyles } from '@fluentui/react-components';
import { getAllPosts } from '../lib/content';
import { useSearchParams } from 'react-router-dom';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    alignItems: 'stretch',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    },
    "@media (max-width: 900px)": {
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    },
    "@media (max-width: 600px)": {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingHorizontalS,
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    "@media (max-width: 600px)": {
      gap: tokens.spacingVerticalS,
    },
  },
  footerRow: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    "@media (max-width: 600px)": {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: tokens.spacingVerticalS,
    },
  },
  // 让标题和摘要在小屏也能良好换行
  titleText: {
    wordBreak: 'break-word',
  },
  summaryText: {
    wordBreak: 'break-word',
  },
});

export default function Home() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const styles = useStyles();
  const all = getAllPosts().filter((p) => p.slug !== 'about');
  const posts = q
    ? all.filter((p) => {
        const t = p.title.toLowerCase();
        const s = (p.summary || '').toLowerCase();
        return t.includes(q) || s.includes(q);
      })
    : all;

  // 日期格式化：将各种可解析的日期字符串格式化为 yyyy/mm/dd
  const formatDate = (s?: string): string => {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  };

  return (
    <div className={styles.grid}>
      {posts.map((p) => (
        <a key={p.slug} href={`/post/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} tabIndex={0}>
          <Card className={styles.card} tabIndex={-1}>
            <Title3 className={styles.titleText}>{p.title}</Title3>
            {p.summary && <Body1 className={styles.summaryText}>{p.summary}</Body1>}
            {p.group && (
              <div style={{ marginTop: 4 }}>
                <a href={`/group/${encodeURIComponent(p.group)}`} style={{ color: tokens.colorBrandForeground1, fontSize: 13, textDecoration: 'underline' }}>分组：{p.group}</a>
              </div>
            )}
            {p.tags && p.tags.length > 0 && (
              <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {p.tags.map(tag => (
                  <a key={tag} href={`/tag/${encodeURIComponent(tag)}`} style={{ color: tokens.colorBrandForeground2, fontSize: 13, background: tokens.colorNeutralBackground3, borderRadius: 4, padding: '1px 8px', textDecoration: 'none' }}>#{tag}</a>
                ))}
              </div>
            )}
            <div className={styles.footerRow}>
              <Subtitle2>{formatDate(p.publishedAt)}</Subtitle2>
              <span style={{ color: tokens.colorBrandForeground1 }}>阅读更多</span>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}