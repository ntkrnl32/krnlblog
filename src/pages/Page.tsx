import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../lib/content';
import RenderedPage from '../components/RenderedPage';
import NotFound from './NotFound';
import SetHttpStatus from '../components/SetHttpStatus';

export default function Page() {
  const { slug = '' } = useParams();
  const page = getPostBySlug(slug);
  if (!page || page.type !== 'page') return <NotFound />;
  const showTitle = page.showTitle !== false; // 默认显示标题，除非明确为 false
  return (
    <>
      <SetHttpStatus status={page.httpStatus} />
      {showTitle && page.title && <h2>{page.title}</h2>}
      <RenderedPage html={page.html} />
    </>
  );
}
