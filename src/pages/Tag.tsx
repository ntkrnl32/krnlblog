import { useParams } from 'react-router-dom';
import { getAllPosts } from '../lib/content';
import { Title2, tokens, makeStyles } from '@fluentui/react-components';
import PostCard from '../components/PostCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    alignItems: 'stretch',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingHorizontalS,
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

export default function Tag() {
  const { tagName } = useParams();
  const styles = useStyles();
  const posts = getAllPosts().filter(p => p.tags && p.tags.includes(tagName || ''));
  return (
    <div>
      <Title2 style={{ marginBottom: 20 }}>标签：{tagName}</Title2>
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} showDate showReadMore />
        ))}
      </div>
    </div>
  );
}
