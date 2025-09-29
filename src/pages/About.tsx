import { Title2, tokens, makeStyles } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { getPostBySlug } from '../lib/content';

const useStyles = makeStyles({
  container: {
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

export default function About() {
  const styles = useStyles();
  const [html, setHtml] = useState<string>('');
  const [title, setTitle] = useState<string>('关于');

  useEffect(() => {
    const post = getPostBySlug('about');
    if (post) {
      setHtml(post.html);
      setTitle(post.title || '关于');
    } else {
      setHtml('<p>请在 content/about.md 中撰写关于页面内容。</p>');
    }
  }, []);

  return (
    <div className={styles.container}>
      <Title2>{title}</Title2>
      <div style={{ marginTop: tokens.spacingVerticalM }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}