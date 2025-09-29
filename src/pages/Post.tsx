import { Title2, tokens, makeStyles } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { getPostBySlug } from '../lib/content';

const useStyles = makeStyles({
  article: {
    maxWidth: '760px',
    margin: '0 auto',
    lineHeight: 1.8,
    fontSize: '16px',
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
    },
    '& pre': {
      overflowX: 'auto',
      padding: tokens.spacingHorizontalM,
      backgroundColor: tokens.colorNeutralBackground2,
      borderRadius: tokens.borderRadiusMedium,
    },
  },
});

export default function Post() {
  const [html, setHtml] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const styles = useStyles();

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop() || '';
    const post = getPostBySlug(slug);
    if (post) {
      setHtml(post.html);
      setTitle(post.title);
    }
  }, []);

  return (
    <div className={styles.article}>
      <Title2>{title}</Title2>
      <div style={{ marginTop: tokens.spacingVerticalM }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}