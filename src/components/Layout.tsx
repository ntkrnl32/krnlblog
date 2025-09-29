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
  mainWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
      padding: tokens.spacingHorizontalM,
    },
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      padding: tokens.spacingHorizontalS,
    },
  },
  container: {
    flex: 1,
    minWidth: 0,
    maxWidth: '920px',
    margin: 0,
    padding: 0,
  },
  sidebar: {
    width: '280px',
    marginLeft: tokens.spacingHorizontalXXL,
    background: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    padding: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
    '@media (max-width: 1100px)': {
      display: 'none',
    },
  },
  footer: {
    marginTop: tokens.spacingVerticalXXL,
    marginBottom: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
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

import { getNotice } from '../lib/content';
export function Layout({ children }: PropsWithChildren) {
  const styles = useStyles();
  const [site, setSite] = useState<any>(null);
  const [notice, setNotice] = useState<string>('');
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

  // 设置页面标题
  useEffect(() => {
    if (!site?.title) return;
    // 设置 favicon
    if (site.icon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = site.icon;
    }
    // 设置标题
    if (location.pathname === '/') {
      document.title = site.title;
    } else if (location.pathname === '/archive') {
      document.title = `归档 - ${site.title}`;
    } else if (location.pathname === '/about') {
      document.title = `关于 - ${site.title}`;
    } else if (location.pathname.startsWith('/tag/')) {
      const tag = decodeURIComponent(location.pathname.replace('/tag/', ''));
      document.title = `标签：${tag} - ${site.title}`;
    } else if (location.pathname.startsWith('/group/')) {
      const group = decodeURIComponent(location.pathname.replace('/group/', ''));
      document.title = `分组：${group} - ${site.title}`;
    } else if (location.pathname === '/' && location.search.includes('q=')) {
      document.title = `搜索 - ${site.title}`;
    } else if (location.pathname.startsWith('/post/')) {
      // 文章页标题在 Post 组件中动态设置
    } else {
      document.title = `${site.title}`;
    }
    if (location.pathname === '/' && location.search.includes('q=')) {
      document.title = `搜索 - ${site.title}`;
    }
  }, [site, location]);

  useEffect(() => {
    fetch('/config.json')
      .then((r) => r.json())
      .then(setSite)
      .catch(() => setSite({ title: 'krnlblog' }));
    // 只渲染 type=notice 的正文
    try {
      const noticePost = getNotice?.();
      if (noticePost) {
        setNotice(noticePost.html);
      } else {
        setNotice('<p>暂无公告</p>');
      }
    } catch {
      setNotice('<p>暂无公告</p>');
    }
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
      <main className={styles.mainWrap}>
        <div className={styles.container}>{children}</div>
        <aside className={styles.sidebar}>
          {site?.author && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={site.author.avatar || site.icon || '/vite.svg'} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{site.author.name}</div>
                  <div style={{ fontSize: 13, color: tokens.colorNeutralForeground3 }}>{site.author.bio}</div>
                </div>
              </div>
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>公告</div>
            <div style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: notice }} />
          </div>
        </aside>
      </main>
      <footer className={styles.footer}>
        <span dangerouslySetInnerHTML={{ __html: site?.footer || 'Powered by React + Fluent UI + Vite' }} />
      </footer>

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