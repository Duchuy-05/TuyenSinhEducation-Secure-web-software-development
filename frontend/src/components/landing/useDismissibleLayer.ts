import { useEffect, type RefObject } from 'react';

interface DismissibleLayerOptions {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  layerRef: RefObject<HTMLElement | null>;
  lockScroll?: boolean;
  trapFocus?: boolean;
}

const focusableSelector = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const useDismissibleLayer = ({ open, onClose, triggerRef, layerRef, lockScroll = false, trapFocus = false }: DismissibleLayerOptions): void => {
  useEffect(() => {
    if (!open) return;
    const layer = layerRef.current;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(layer?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    focusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (!trapFocus || event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const [first] = items;
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!layer?.contains(target) && !triggerRef.current?.contains(target)) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [layerRef, lockScroll, onClose, open, trapFocus, triggerRef]);
};
