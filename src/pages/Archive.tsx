import { Title2, Title3, Body1, Card, tokens, makeStyles } from '@fluentui/react-components';
import { getAllPosts, type PostMeta } from '../lib/content';

const useStyles = makeStyles({
  container: {
    maxWidth: '760px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    '@media (max-width: 900px)': {
      padding: tokens.spacingHorizontalM,
    },
    '@media (max-width: 600px)': {
      padding: tokens.spacingHorizontalS,
    },
  },
  group: {
    marginTop: tokens.spacingVerticalXL,
  },
  list: {
    marginTop: tokens.spacingVerticalS,
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingVerticalS,
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    cursor: 'pointer',
    textDecoration: 'none',
    '@media (max-width: 600px)': {
      gap: tokens.spacingVerticalS,
    },
  },
  titleText: {
    wordBreak: 'break-word',
    fontWeight: 600,
  },
  footerRow: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: tokens.spacingVerticalS,
    },
  },
});

function groupByMonth(posts: PostMeta[]): Array<{ key: string; items: PostMeta[] }> {
  const groups: Record<string, PostMeta[]> = {};
  for (const p of posts) {
    let key = '未分组';
    if (p.publishedAt) {
      const d = new Date(p.publishedAt);
      if (!isNaN(d.getTime())) {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
    }
    (groups[key] ||= []).push(p);
  }
  const entries = Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === '未分组') return 1;
      if (b === '未分组') return -1;
      return b.localeCompare(a);
    })
    .map(([key, items]) => ({ key, items }));
  return entries;
}

export default function Archive() {
  const styles = useStyles();
  const posts = getAllPosts();
  const groups = groupByMonth(posts);

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
    <div className={styles.container}>
      <Title2>归档</Title2>
      {groups.map((g) => (
        <section key={g.key} className={styles.group}>
          <Title3>{g.key}</Title3>
          <div className={styles.list}>
            {g.items.map((p) => (
              <a key={p.slug} href={`/post/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} tabIndex={0}>
                <Card className={styles.card} tabIndex={-1}>
                  <div className={styles.titleText}>{p.title}</div>
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
                    <Body1 style={{ color: tokens.colorNeutralForeground3 }}>{formatDate(p.publishedAt)}</Body1>
                    <span style={{ color: tokens.colorBrandForeground1 }}>阅读更多</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}