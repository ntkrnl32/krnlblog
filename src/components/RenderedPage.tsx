import { tokens, makeStyles } from '@fluentui/react-components';
import { useEffect, useRef } from 'react';
import { highlightAllCodeBlocks } from '../lib/highlight';

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

export type RenderedPageProps = {
  html: string;
};

export default function RenderedPage({ html }: RenderedPageProps) {
  const styles = useStyles();
  const articleRef = useRef<HTMLDivElement>(null);

  function getIsDark() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  useEffect(() => {
    if (articleRef.current) {
      highlightAllCodeBlocks(articleRef.current, getIsDark());
    }
  }, [html]);

  return (
    <div className={styles.article} ref={articleRef}>
      <div style={{ marginTop: tokens.spacingVerticalM }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
