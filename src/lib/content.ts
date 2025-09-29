import matter from 'gray-matter';
import { marked } from 'marked';
import { Buffer } from 'buffer';
// @ts-ignore
window.Buffer = window.Buffer || Buffer;

export type PostMeta = {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  tags?: string[];
  group?: string;
  type?: 'post' | 'notice' | 'page' | '';
};

export type Post = PostMeta & {
  html: string;
};

// 通过 Vite 的 import.meta.glob 原始方式在构建阶段收集所有 Markdown 内容
const modules = import.meta.glob('../../content/*.md', { as: 'raw', eager: true });

const posts: Post[] = Object.entries(modules).map(([path, raw]) => {
  const { data, content } = matter(raw as string);
  const html = marked.parse(content) as string; // 确保类型为 string
  const slug = String(data.slug ?? path.split('/').pop()?.replace('.md', ''));
  let tags: string[] | undefined = undefined;
  if (Array.isArray(data.tags)) {
    tags = data.tags.map((t: any) => String(t));
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }
  const type = (data.type ?? '').toLowerCase();
  return {
    slug,
    title: String(data.title ?? slug),
    summary: data.summary ? String(data.summary) : undefined,
    publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
    tags,
    group: data.group ? String(data.group) : undefined,
    type: type === 'notice' ? 'notice' : type === 'page' ? 'page' : (type === 'post' || !type) ? 'post' : '',
    html,
  };
});


// 只返回 type 为空或 post 的内容，且不包含 page/notice
export function getAllPosts(): PostMeta[] {
  return posts
    .filter(p => !p.type || p.type === 'post')
    .map(({ html, ...meta }) => meta)
    .sort((a, b) => String(b.publishedAt ?? '').localeCompare(String(a.publishedAt ?? '')));
}

// 获取唯一公告（type=notice）
export function getNotice(): Post | undefined {
  return posts.find(p => p.type === 'notice');
}

// 获取所有 page（type=page）
export function getAllPages(): PostMeta[] {
  return posts.filter(p => p.type === 'page').map(({ html, ...meta }) => meta);
}

// 获取所有 post（type=post 或空）
export function getAllNormalPosts(): PostMeta[] {
  return posts.filter(p => !p.type || p.type === 'post').map(({ html, ...meta }) => meta);
}

// 只允许 type=post 或空的 slug 被访问
export function getPostBySlug(slug: string): Post | undefined {
  const p = posts.find((p) => p.slug === slug);
  if (!p) return undefined;
  if (!p.type || p.type === 'post') return p;
  return undefined;
}