import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800" dir="rtl">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-red-200 text-center">
            <h2 className="text-base font-bold text-red-700 font-heading mb-2">عذراً، حدث خطأ أثناء عرض الصفحة</h2>
            <p className="text-xs text-slate-600 mb-4">
              {this.state.error?.message || 'خطأ غير متوقع في واجهة المستخدم.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
