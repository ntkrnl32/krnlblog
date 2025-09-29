import { useEffect } from 'react';

export default function SetHttpStatus({ status }: { status?: number }) {
  useEffect(() => {
    if (typeof status === 'number' && status >= 300) {
      // 仅在支持的环境下设置状态码（如 SSR 或部分前端集成）
      if (typeof window !== 'undefined') {
        // 客户端无法真正设置 HTTP 状态码，但可用于集成 SSR 或埋点
        // 可扩展：window.__KRNLBLOG_HTTP_STATUS = status;
      }
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-http-status', String(status));
      }
    }
  }, [status]);
  return null;
}
