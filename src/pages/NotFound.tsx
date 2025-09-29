import RenderedPage from '../components/RenderedPage';
import { getPostBySlug } from '../lib/content';

export default function NotFound() {
  const notFound = getPostBySlug('NOT_FOUND') || getPostBySlug('not_found');
  return <RenderedPage html={notFound?.html || '<h2>404 - 页面未找到</h2>'} />;
}
