import { landingContent } from '../../content/landingContent';

export default function LearningPaths() {
  return (
    <section id="learning-paths" className="learning-paths landing-section-anchor" aria-labelledby="learning-paths-title">
      <div className="page-frame">
        <h2 id="learning-paths-title">Chọn lộ trình theo mục tiêu</h2>
        <ul className="learning-paths__list">
          {landingContent.learningPaths.map((path) => (
            <li key={path.id} className="learning-paths__card">
              <h3>{path.title}</h3>
              <p className="learning-paths__entry">{path.entry}</p>
              <p className="learning-paths__courses"><strong>Học phần</strong><span>{path.courses.join(' · ')}</span></p>
              <p className="learning-paths__outcome">{path.outcome}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
