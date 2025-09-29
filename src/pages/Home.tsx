import { Card, Title3, Subtitle2, Body1, Link, tokens } from '@fluentui/react-components';
import { getAllPosts } from '../lib/content';

export default function Home() {
  const posts = getAllPosts();
  return (
    <div
      style={{
        display: 'grid',
        gap: tokens.spacingHorizontalM,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        alignItems: 'stretch',
      }}
    >
      {posts.map((p) => (
        <Card key={p.slug} style={{ height: '100%' }}>
          <Title3>{p.title}</Title3>
          {p.summary && <Body1>{p.summary}</Body1>}
          <Subtitle2>{p.publishedAt}</Subtitle2>
          <Link href={`/post/${p.slug}`}>阅读更多</Link>
        </Card>
      ))}
    </div>
  );
}