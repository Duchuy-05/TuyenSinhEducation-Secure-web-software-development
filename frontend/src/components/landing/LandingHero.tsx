import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroMedia from '../../assets/banner1.png';
import { landingContent } from '../../content/landingContent';

export default function LandingHero() {
  const { hero } = landingContent;
  return <section className="landing-hero" aria-labelledby="landing-title">
    <div className="page-frame landing-hero-layout">
      <div className="landing-hero-copy" data-reveal-part>
        <h1 id="landing-title" aria-label="Khóa học về công nghệ">
          <span data-testid="landing-title-line-1">Khóa học về{' '}</span>
          <br className="landing-title-break" />
          <span data-testid="landing-title-line-2">công nghệ</span>
        </h1>
        <p>{hero.description}</p>
        <div className="landing-hero-actions">
          <Link to={hero.primaryCta.href} className="button button-primary">{hero.primaryCta.label}<ArrowRight aria-hidden="true" size={19} /></Link>
          <Link to={hero.secondaryCta.href} className="text-link">{hero.secondaryCta.label}</Link>
        </div>
      </div>
      <figure className="landing-hero-media" data-reveal-part>
        <img src={heroMedia} alt={hero.mediaAlt} />
      </figure>
    </div>
  </section>;
}
