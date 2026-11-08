import { useCallback, useEffect, useState } from 'react';
import { teacherApi, type Teacher } from '../../services/teacher.api';
import fallbackImage from '../../assets/course-fallback.svg';
import AsyncSectionState, { type AsyncStatus } from './AsyncSectionState';

export default function TeacherShowcase({ loadTeachers = teacherApi.getAllTeachers }: { loadTeachers?: () => Promise<Teacher[]> }) {
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const load = useCallback(async () => { setStatus('loading'); try { const list = await loadTeachers(); const safe = Array.isArray(list) ? list : []; setTeachers(safe); setStatus(safe.length ? 'success' : 'empty'); } catch { setStatus('error'); } }, [loadTeachers]);
  useEffect(() => { void load(); }, [load]);
  return <section id="teachers" className="teacher-showcase landing-section-anchor" aria-labelledby="teachers-title"><div className="page-frame"><h2 id="teachers-title">Đội ngũ giảng viên</h2><AsyncSectionState status={status} title="Giảng viên" onRetry={load} emptyAction={{ label: 'Liên hệ tư vấn', href: '/lien-he' }}><div className="teacher-grid">{teachers.map((teacher) => <article className="teacher-card" key={teacher.id}><img src={teacher.avatarUrl || fallbackImage} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={teacher.fullName} /><h3>{teacher.fullName}</h3>{(teacher.title || teacher.specialization) && <p>{teacher.title || teacher.specialization}</p>}{teacher.experience && <p>Kinh nghiệm: {teacher.experience}</p>}{teacher.bio && <p>{teacher.bio}</p>}</article>)}</div></AsyncSectionState></div></section>;
}
