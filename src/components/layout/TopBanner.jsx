"use client";
import { useLanguage } from '../../hooks/useLanguage';

export default function TopBanner() {
  const { t } = useLanguage();
  return (
    <div className="w-full bg-brand-orange text-center text-xs font-semibold py-2 text-white uppercase tracking-widest hidden md:block">
      {t('TopBanner.message')}
    </div>
  );
}
