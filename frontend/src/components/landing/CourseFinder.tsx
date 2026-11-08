import { useState } from 'react';
import { Link } from 'react-router-dom';
import { landingContent } from '../../content/landingContent';
export type CourseGoal = 'beginner' | 'frontend' | 'backend' | 'ui-ux';
export default function CourseFinder({ initialGoal = 'beginner' }: { initialGoal?: CourseGoal }) {
  const validGoal = landingContent.courseGoals.some((goal) => goal.value === initialGoal) ? initialGoal : 'beginner';
  const [goal, setGoal] = useState<CourseGoal>(validGoal);
  const selected = landingContent.courseGoals.find((item) => item.value === goal)!;
  return <section id="course-finder" className="course-finder landing-section-anchor" aria-labelledby="course-finder-title"><div className="page-frame"><h2 id="course-finder-title">Bạn muốn học để làm gì?</h2><fieldset><legend className="sr-only">Mục tiêu học tập</legend><div className="goal-options">{landingContent.courseGoals.map((item) => <label key={item.value} className={goal === item.value ? 'goal-option is-selected' : 'goal-option'}><input type="radio" name="course-goal" value={item.value} checked={goal === item.value} onChange={() => setGoal(item.value)} />{item.label}</label>)}</div></fieldset><p className="course-finder-result">Bạn sẽ xem danh mục phù hợp với mục tiêu: <strong>{selected.label}</strong>.</p><Link className="button button-primary" to={`/danh-muc-khoa-hoc?${new URLSearchParams({ goal: selected.queryValue })}`}>Xem khóa phù hợp</Link></div></section>;
}
