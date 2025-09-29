import { Card, Title3, Body1, tokens, makeStyles } from '@fluentui/react-components';
import type { PostMeta } from '../lib/content';

const useStyles = makeStyles({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    "@media (max-width: 600px)": {
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

export default function PostCard({ post }: { post: PostMeta }) {
  const styles = useStyles();
  return (
    <a href={`/post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} tabIndex={0}>
      <Card className={styles.card} tabIndex={-1}>
        <Title3 className={styles.titleText}>{post.title}</Title3>
        {post.summary && <Body1 className={styles.summaryText}>{post.summary}</Body1>}
      </Card>
    </a>
  );
}
