import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'مُيسر للتطوير العقاري | مشاريع سكنية استثنائية بالمنطقة الشرقية',
  '/projects': 'مشاريعنا | مُيسر للتطوير العقاري',
  '/about': 'من نحن | مُيسر للتطوير العقاري',
  '/services': 'خدماتنا | مُيسر للتطوير العقاري',
  '/contact': 'تواصل معنا | مُيسر للتطوير العقاري',
  '/admin': 'لوحة التحكم | مُيسر للتطوير العقاري',
  '/admin/login': 'تسجيل الدخول | مُيسر للتطوير العقاري',
};

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (titles[pathname]) {
      document.title = titles[pathname];
    } else if (pathname.startsWith('/projects/')) {
      document.title = 'تفاصيل المشروع | مُيسر للتطوير العقاري';
    }
  }, [pathname]);

  return null;
}
