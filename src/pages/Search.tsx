import { useSearchParams } from 'react-router-dom';
import { getAllPosts } from '../lib/content';
import { tokens, makeStyles, Input, Button } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import PostCard from '../components/PostCard';

const useStyles = makeStyles({
  searchWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '32px 0 40px 0',
    width: '100%',
  },
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    width: '100%',
    maxWidth: '400px',
  },
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
  titleText: {
    wordBreak: 'break-word',
  },
  summaryText: {
    wordBreak: 'break-word',
  },
});

import { useState } from 'react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const q = input.trim().toLowerCase();
  const styles = useStyles();
  const all = getAllPosts();
  const posts = q
    ? all.filter((p) => {
        const t = p.title.toLowerCase();
        const s = (p.summary || '').toLowerCase();
        return t.includes(q) || s.includes(q);
      })
    : all;

  const handleInput = (_: any, data: { value: string }) => {
    setInput(data.value);
  };
  const handleSearch = () => {
    setSearchParams(input ? { q: input } : {});
  };

  return (
    <>
      <div className={styles.searchWrap}>
        <form
          className={styles.searchRow}
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            value={input}
            onChange={handleInput}
            placeholder="搜索文章"
            aria-label="搜索"
            style={{ flex: 1 }}
          />
          <Button type="submit" appearance="primary" icon={<Search24Regular />} aria-label="搜索" style={{ minWidth: 44, minHeight: 44, padding: 0 }} />
        </form>
      </div>
      <div className={styles.grid}>
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} showDate showReadMore formatDate={(s) => {
            if (!s) return '';
            const d = new Date(s);
            if (isNaN(d.getTime())) return s;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}/${mm}/${dd}`;
          }} />
        ))}
      </div>
    </>
  );
}
