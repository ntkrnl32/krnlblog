import { FluentProvider, webLightTheme, tokens, TabList, Tab, makeStyles, Link } from '@fluentui/react-components';
import { Notebook20Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (max-width: 600px)": {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: tokens.spacingHorizontalS,
      padding: tokens.spacingHorizontalM,
    },
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    "@media (max-width: 600px)": {
      fontSize: tokens.fontSizeBase500,
    },
  },
  navRight: {
    marginLeft: 'auto',
    "@media (max-width: 600px)": {
      marginLeft: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
    },
  },
  container: {
    maxWidth: '920px',
    margin: '0 auto',
    padding: tokens.spacingHorizontalL,
    "@media (max-width: 900px)": {
      padding: tokens.spacingHorizontalM,
    },
    "@media (max-width: 600px)": {
      padding: tokens.spacingHorizontalS,
    },
  },
  footer: {
    marginTop: tokens.spacingVerticalXXL,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
    "@media (max-width: 600px)": {
      paddingTop: tokens.spacingVerticalS,
      marginTop: tokens.spacingVerticalXL,
    },
  },
});

export function Layout({ children }: PropsWithChildren) {
  const styles = useStyles();
  const [site, setSite] = useState<{ title: string; description?: string } | null>(null);

  useEffect(() => {
    fetch('/config.json')
      .then((r) => r.json())
      .then(setSite)
      .catch(() => setSite({ title: 'krnlblog' }));
  }, []);

  return (
    <FluentProvider theme={webLightTheme}>
      <header className={styles.header}>
        <Notebook20Regular />
        <div className={styles.title}>{site?.title ?? 'krnlblog'}</div>
        <div className={styles.navRight}>
          <TabList selectedValue="home">
            <Tab value="home">
              <Link href="/">首页</Link>
            </Tab>
          </TabList>
        </div>
      </header>
      <main className={styles.container}>{children}</main>
      <footer className={styles.footer}>Powered by React + Fluent UI + Vite</footer>
    </FluentProvider>
  );
}