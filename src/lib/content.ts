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
  return {
    slug,
    title: String(data.title ?? slug),
    summary: data.summary ? String(data.summary) : undefined,
    publishedAt: data.publishedAt ? String(data.publishedAt) : undefined,
    html,
  };
});

export function getAllPosts(): PostMeta[] {
  return posts
    .map(({ html, ...meta }) => meta)
    .sort((a, b) => String(b.publishedAt ?? '').localeCompare(String(a.publishedAt ?? '')));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}