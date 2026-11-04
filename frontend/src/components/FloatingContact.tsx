import { useCallback, useRef, useState } from 'react';
import { ExternalLink, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { landingContent } from '../content/landingContent';
import { useDismissibleLayer } from './landing/useDismissibleLayer';

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useDismissibleLayer({ open, onClose: close, triggerRef, layerRef: dialogRef, lockScroll: true, trapFocus: true });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="contact-launcher"
        aria-label="Liên hệ Đức Huy Education"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MessageCircle aria-hidden="true" />
      </button>

      {open && (
        <div className="dialog-backdrop" aria-hidden="false">
          <div ref={dialogRef} className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
            <button type="button" className="dialog-close" aria-label="Đóng hộp thoại" onClick={close}><X aria-hidden="true" /></button>
            <div className="contact-dialog-heading">
              <span className="contact-dialog-mark"><MessageCircle aria-hidden="true" /></span>
              <div>
                <h2 id="contact-dialog-title">Liên hệ Đức Huy Education</h2>
                <p>Trao đổi với chúng tôi để chọn lộ trình học phù hợp.</p>
              </div>
            </div>
            <div className="contact-options">
              <a href={`tel:${landingContent.contact.phone}`}><Phone aria-hidden="true" /> Gọi {landingContent.contact.phone}</a>
              <a href={`mailto:${landingContent.contact.email}`}><Mail aria-hidden="true" /> Gửi email tư vấn</a>
              <a href="https://www.facebook.com/ntdhuy.2k5/" target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" /> Nhắn tin Facebook</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContact;
