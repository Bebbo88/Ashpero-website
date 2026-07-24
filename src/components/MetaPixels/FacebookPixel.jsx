'use client'; // لازم يكون Client Component عشان يراقب المتصفح

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // التأكد إننا في المتصفح وإن كود الفيسبوك اتحمل
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]); // الكود ده هيتنفذ كل ما الرابط أو الـ Query يتغير

  return null; // الكومبوننت ده مخفي، وظيفته يشتغل في الخلفية بس
}