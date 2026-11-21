import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, CheckCircle2, ArrowLeft, Target, Award, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';
import { brand } from '../data/projectData.js';

export default function AboutPage() {
  const values = [
    { title: 'الاستقلالية المعمارية', desc: 'كل وحدة سكنية مصممة بصك إلكتروني مستقل وعدادات منفصلة ومداخل وكراجات خاصة تضمن الخصوصية الكاملة.' },
    { title: 'الجودة الإنشائية المستدامة', desc: 'التزام صارم باشتراطات كود البناء السعودي وتأمين شامل ضد العيوب الخفية يمتد إلى 10 سنوات.' },
    { title: 'الشفافية والموثوقية', desc: 'تسجيل رسمي وتراخيص معتمدة من الهيئة العامة للعقار (فال) وتوثيق لكافة مراحل التنفيذ وضمانات المواد.' },
    { title: 'خدمات ما بعد البيع', desc: 'مرافقة مستمرة للعميل تشمل الصيانة المجانية في السنة الأولى وتأسيس وإدارة اتحاد الملاك لتيسير السكن.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />

      <section className="bg-slate-950 text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">عن مُيسر</span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white">
            رواد ابتكار المجتمعات السكنية المستقلة
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            شركة مُيسر للتطوير العقاري هي مؤسسة وطنية متخصصة في تطوير مشاريع التاون هاوس والدوبلكسات الفاخرة بالمنطقة الشرقية، تركز على تلبية تطلعات الأسرة السعودية في مسكن يجمع بين الأناقة والاستدامة.
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">منهجيتنا في التطوير</span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              أكثر من مجرد مبانٍ.. نصنع أسلوب حياة عائلي
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              انطلقت شركة مُيسر برؤية ترتكز على معالجة التحديات السكنية التقليدية من خلال توفير وحدات تتمتع باستقلالية تامة شبيهة بالفيلا المستقلة وبقيمة استثمارية مدروسة تناسب برامج التمويل البنكي المدعوم.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نختار مواقع مشاريعنا بعناية فائقة لتكون مجاورة للحدائق العامة والمحاور الحيوية، مع تطبيق معايير كفاءة الطاقة والإنارة الطبيعية والأفنية السماوية في كل تصميم.
            </p>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <ShieldCheck className="w-8 h-8 text-emerald-800" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">التراخيص والاعتمادات</h3>
                <span className="text-[11px] text-slate-500">توثيق نظامي رسمي معتمد</span>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">رقم ترخيص الهيئة (REGA):</span>
                <span className="font-mono font-bold tabular-nums">{brand.regaLicense || '1200028945'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">رقم ترخيص فال (VAL):</span>
                <span className="font-mono font-bold tabular-nums">{brand.falLicense || '1100012345'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">المقر الرئيسي:</span>
                <span>{brand.city} — {brand.country}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">كود البناء:</span>
                <span className="text-emerald-800 font-bold">معتمد ومطابق 100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">ركائزنا الأساسية</span>
            <h2 className="text-2xl font-black font-heading text-slate-900">القيم التي نبني بها ثقة عملائنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
                  {idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl font-bold font-heading">تصفح مشاريعنا السكنية المتاحة</h3>
            <p className="text-xs text-stone-200">تعرف على نماذج تاون هاوس الشامخة والخيارات السكنية المتاحة حالياً.</p>
          </div>
          <Link to="/projects" className="px-6 py-3 bg-white text-emerald-950 text-xs font-bold rounded-xl hover:bg-stone-100 transition whitespace-nowrap inline-flex items-center gap-1.5 shadow-xs">
            <span>دليل المشاريع</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
