import { useEffect, useState } from 'react';
import { getPostBySlug } from '../lib/content';
import RenderedPage from '../components/RenderedPage';

export default function About() {
  const [html, setHtml] = useState<string>('');
  const [title, setTitle] = useState<string>('关于');

  useEffect(() => {
    const post = getPostBySlug('about');
    if (post) {
      setHtml(post.html);
      setTitle(post.title || title);
    } else {
      setHtml('<p>请在 content/about.md 中撰写关于页面内容。</p>');
    }
  }, []);

  return <RenderedPage html={html} />;
}