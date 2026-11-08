import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => (
  <section className="cta-banner" aria-labelledby="cta-title">
    <div className="page-frame">
      <h2 id="cta-title" data-reveal-part>Chọn khóa học phù hợp</h2>
      <p className="cta-copy" data-reveal-part>Xem các khóa học đang mở hoặc trao đổi với chúng tôi nếu bạn chưa biết nên bắt đầu từ đâu.</p>
      <div className="btn-group" data-reveal-part>
        <Link to="/danh-muc-khoa-hoc" className="button button-primary">Xem khóa học <ArrowRight aria-hidden="true" size={19} /></Link>
        <Link to="/lien-he" className="text-link">Liên hệ tư vấn</Link>
      </div>
    </div>
  </section>
);

export default CTA;
