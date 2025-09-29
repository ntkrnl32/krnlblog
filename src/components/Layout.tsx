const globalCodeBlockStyle = `
  pre, code {
    word-break: break-all;
    white-space: pre-wrap;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    font-size: 15px;
    line-height: 1.6;
  }
  pre {
    overflow-x: auto;
    background: #1818180a;
    border-radius: 6px;
    padding: 1em;
    margin: 1em 0;
    max-width: 100vw;
    box-sizing: border-box;
  }
  @media (max-width: 600px) {
    pre, code {
      font-size: 13px;
    }
    pre {
      white-space: pre;
      word-break: break-all;
      overflow-x: auto;
      max-width: 100vw;
    }
  }
`;

import { FluentProvider, webLightTheme, webDarkTheme, tokens, TabList, Tab, makeStyles, Link, Button } from '@fluentui/react-components';
import { Notebook20Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: tokens.spacingVerticalXS,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'center',
  },
  desc: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '16px',
    marginTop: '2px',
    marginBottom: '2px',
    lineHeight: 1.5,
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
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
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
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
    display: 'flex',
  },
  mobileNav: {
    display: 'none',
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
    zIndex: 1, // 保证主内容不被菜单遮挡
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
import RenderedPage from './RenderedPage';
export function Layout({ children }: PropsWithChildren) {
  // 已在顶部声明 navigate/location
  const styles = useStyles();
  const location = useLocation();
  const [site, setSite] = useState<any>(null);
  const [notice, setNotice] = useState<{ html: string; title?: string } | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [ctx, setCtx] = useState<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 });
  const currentTab = location.pathname.startsWith('/archive')
    ? 'archive'
    : location.pathname.startsWith('/search')
    ? 'search'
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
        setNotice({ html: noticePost.html, title: noticePost.title });
      } else {
        setNotice({ html: '<p>暂无公告</p>' });
      }
    } catch {
      setNotice({ html: '<p>暂无公告</p>' });
    }
  }, []);



  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtx({ open: true, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setCtx({ open: false, x: 0, y: 0 });

  return (
    <>
      <style>{globalCodeBlockStyle}</style>
      <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} className={styles.root} onContextMenu={handleContextMenu}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleRow}>
            {site?.icon ? (
              <img src={site.icon} alt="logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <Notebook20Regular />
            )}
            <div className={styles.title}>{site?.title ?? 'krnlblog'}</div>
          </div>
          {site?.description && (
            <div className={styles.desc}>{site.description}</div>
          )}
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
              <Tab value="search">
                <Link href="/search">搜索</Link>
              </Tab>
              <Tab value="about">
                <Link href={site?.aboutMenuHref || '/about'}>关于</Link>
              </Tab>
            </TabList>
          </div>
          {/* <div className={styles.mobileNav}>
            <Menu>
              <MenuTrigger>
                <Button appearance="subtle" icon={<MoreHorizontal20Regular />} aria-label="菜单" />
              </MenuTrigger>
              <MenuPopover style={{ zIndex: 1101 }}>
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
          </div> */}
        </div>
      </header>
      <main className={styles.mainWrap}>
        <div className={styles.container}>{children}</div>
        <aside className={styles.sidebar}>
          {/* 作者信息块 */}
          {site?.author && (
            <section style={{ marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={site.author.avatar || site.icon || '/vite.svg'} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{site.author.name}</div>
                  <div style={{ fontSize: 13, color: tokens.colorNeutralForeground3 }}>{site.author.bio}</div>
                </div>
              </div>
            </section>
          )}
          {/* 公告块 */}
          <section style={{ marginBottom: 32, paddingBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>公告</div>
            <div style={{ fontSize: 14 }}>
              <RenderedPage html={notice?.html || ''} />
            </div>
          </section>
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
    </>
  );
}