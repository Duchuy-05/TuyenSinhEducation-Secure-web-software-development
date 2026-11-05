import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type AsyncStatus = 'loading' | 'error' | 'empty' | 'success';
type Props = { status: AsyncStatus; title: string; onRetry?: () => void; children?: ReactNode; emptyAction?: { label: string; href: string } };
export default function AsyncSectionState({ status, title, onRetry, children, emptyAction }: Props) {
  if (status === 'success') return <>{children}</>;
  if (status === 'loading') return <div className="async-state" role="status" aria-busy="true"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /><span className="sr-only">Đang tải {title}</span></div>;
  if (status === 'error') return <div className="async-state async-state-error" role="alert"><p>Không thể tải {title.toLowerCase()} lúc này.</p>{onRetry && <button className="button button-primary" type="button" onClick={onRetry}>Thử lại</button>}</div>;
  return <div className="async-state"><p>Chưa có {title.toLowerCase()} để hiển thị.</p>{emptyAction && <Link className="text-link" to={emptyAction.href}>{emptyAction.label}</Link>}</div>;
}
