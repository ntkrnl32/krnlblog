import { FluentProvider, webLightTheme, webDarkTheme, tokens, TabList, Tab, makeStyles, Link, Button, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Input } from '@fluentui/react-components';
import { Notebook20Regular, MoreHorizontal20Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (max-width: 600px)": {
      padding: tokens.spacingHorizontalM,
    },
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    "@media (max-width: 600px)": {
      fontSize: tokens.fontSizeBase500,
    },
  },
  navBelow: {
    marginTop: tokens.spacingVerticalS,
  },
  navRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 600px)": {
      marginLeft: 0,
      width: '100%',
      justifyContent: 'flex-end',
      gap: tokens.spacingHorizontalS,
    },
  },
  desktopNav: {
    display: 'block',
    "@media (max-width: 600px)": {
      display: 'none',
    },
  },
  mobileNav: {
    display: 'none',
    "@media (max-width: 600px)": {
      display: 'block',
    },
  },
  searchBox: {
    width: '260px',
    "@media (max-width: 600px)": {
      width: '100%',
    },
  },
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  container: {
    maxWidth: '920px',
    margin: '0 auto',
    padding: tokens.spacingHorizontalL,
    flex: 1,
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
  contextBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  contextMenu: {
    position: 'fixed',
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    padding: tokens.spacingHorizontalS,
    minWidth: '160px',
  },
});

export function Layout({ children }: PropsWithChildren) {
  const styles = useStyles();
  const [site, setSite] = useState<{ title: string; description?: string } | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<string>(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 });
  const currentTab = location.pathname.startsWith('/archive')
    ? 'archive'
    : location.pathname.startsWith('/about')
    ? 'about'
    : 'home';

  useEffect(() => {
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  useEffect(() => {
    fetch('/config.json')
      .then((r) => r.json())
      .then(setSite)
      .catch(() => setSite({ title: 'krnlblog' }));
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') ?? '';
    setSearch(q);
  }, [location.search]);

  const submitSearch = (q: string) => {
    const next = q.trim();
    navigate(next ? `/?q=${encodeURIComponent(next)}` : '/');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtx({ open: true, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setCtx({ open: false, x: 0, y: 0 });

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} className={styles.root} onContextMenu={handleContextMenu}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Notebook20Regular />
          <div className={styles.title}>{site?.title ?? 'krnlblog'}</div>
          <div className={styles.navRight}>
            <Input
              className={styles.searchBox}
              placeholder="搜索文章"
              value={search}
             onChange={(_, data) => setSearch(data.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter') submitSearch(search);
             }}
             aria-label="搜索"
             />
          </div>
        </div>
        <div className={styles.navBelow}>
          <div className={styles.desktopNav}>
            <TabList selectedValue={currentTab}>
              <Tab value="home">
                <Link href="/">首页</Link>
              </Tab>
              <Tab value="archive">
                <Link href="/archive">归档</Link>
              </Tab>
              <Tab value="about">
                <Link href="/about">关于</Link>
              </Tab>
            </TabList>
          </div>
          <div className={styles.mobileNav}>
            <Menu>
              <MenuTrigger>
                <Button appearance="subtle" icon={<MoreHorizontal20Regular />} aria-label="菜单" />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem>
                    <Link href="/">首页</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href="/archive">归档</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href="/about">关于</Link>
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      </header>
      <main className={styles.container}>{children}</main>
      <footer className={styles.footer}>Powered by React + Fluent UI + Vite</footer>

      {ctx.open && (
        <>
          <div className={styles.contextBackdrop} onClick={closeContextMenu} />
          <div className={styles.contextMenu} style={{ left: ctx.x, top: ctx.y }} onClick={closeContextMenu}>
            <Button appearance="subtle" onClick={() => setIsDark((v) => !v)}>
              切换深色模式
            </Button>
          </div>
        </>
      )}
    </FluentProvider>
  );
}