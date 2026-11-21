import { Link } from 'react-router-dom';
import { Building2, Compass, Layers, Cpu, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.jsx';

const servicesList = [
  {
    icon: Building2,
    num: '01',
    title: 'التطوير العقاري السكني الشامل',
    desc: 'تخطيط وتنفيذ مجتمعات تاون هاوس حديثة بمعايير هندسية متقدمة تضمن الاستقلالية التامة للوحدة والمدخل والكراج، مع استخراج الصكوك الإلكترونية وتراخيص الإفراغ الفوري.',
    features: ['إشراف هندسي معتمد في جميع مراحل البناء', 'مطابقة شاملة لكود البناء السعودي الصارم', 'صكوك ملكية إلكترونية مستقلة لكل وحدة'],
  },
  {
    icon: Compass,
    num: '02',
    title: 'التصميم المعماري الداخلي واستغلال الفراغات',
    desc: 'دراسات هندسية دقيقة لتوزيع المساحات تحقق أقصى درجات الراحة والخصوصية للعائلة، مع توظيف الأفنية السماوية (Sky Light) لتحقيق وفرة في الإنارة الطبيعية وتقليل استهلاك الطاقة.',
    features: ['مخططات وظيفية مدروسة للحياة اليومية', 'توزيع متوازن بين أجنحة النوم ومساحات الاستقبال', 'واجهات عصرية متناسقة مع الهوية العمرانية'],
  },
  {
    icon: Layers,
    num: '03',
    title: 'المطابخ والتشطيبات الفاخرة المعتمدة',
    desc: 'توريد وتركيب مواد تشطيب عالية الجودة بشراكة مع كبرى العلامات المعتمدة، لضمان استدامة التمديدات والدهانات والعوازل مع شهادات ضمان موثقة وممتدة.',
    features: ['دهانات جوتن المعتمدة عالمياً ومحلياً', 'قواطع وتمديدات كهربائية من الفنار بضمان 25 سنة', 'عوازل مائية وحرارية معتمدة من شركة الكهرباء'],
  },
  {
    icon: Cpu,
    num: '04',
    title: 'تأسيس البنية الذكية وحلول الأتمتة',
    desc: 'تجهيز الوحدات بالبنية التحتية اللازمة لدعم حلول المنازل الذكية، بما في ذلك أقفال الأبواب الإلكترونية، وأجهزة التحكم بالإضاءة والتكييف، وتأسيس شبكات الألياف البصرية.',
    features: ['تأسيس مسبق لتمديدات المصاعد في النماذج العلوية', 'نقاط تحكم ذكية للأمان ومراقبة المداخل', 'بنية اتصالات متطورة لتغطية كامل أرجاء المسكن'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir="rtl">
      <Navbar />

      <section className="bg-slate-950 text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">مجالات اختصاصنا</span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white">
            خدمات عقارية متكاملة تبدأ من الفكرة حتى السكن
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            نقدم منظومة تطويرية متكاملة تضمن أعلى درجات الموثوقية الهندسية والقيمة الاستثمارية المستدامة لعملائنا في المنطقة الشرقية.
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 hover:border-emerald-700/40 transition duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">{srv.num}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">{srv.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  {srv.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-stone-100/80 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-heading">ترغب في استشارة هندسية أو استفسار عن خدماتنا؟</h3>
            <p className="text-xs text-slate-600">فريقنا متاح لتزويدك بكافة المخططات وجداول الكميات المعتمدة.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-2 whitespace-nowrap shadow-xs">
            <span>تواصل مع الفريق الهندسي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
