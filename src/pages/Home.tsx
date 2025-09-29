import { Card, Title3, Subtitle2, Body1, Link, tokens, makeStyles } from '@fluentui/react-components';
import { getAllPosts } from '../lib/content';
import { useSearchParams } from 'react-router-dom';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    alignItems: 'stretch',
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
        <Card key={p.slug} className={styles.card}>
          <Title3 className={styles.titleText}>{p.title}</Title3>
          {p.summary && <Body1 className={styles.summaryText}>{p.summary}</Body1>}
          <div className={styles.footerRow}>
            <Subtitle2>{formatDate(p.publishedAt)}</Subtitle2>
            <Link href={`/post/${p.slug}`}>阅读更多</Link>
          </div>
        </Card>
      ))}
    </div>
  );
}