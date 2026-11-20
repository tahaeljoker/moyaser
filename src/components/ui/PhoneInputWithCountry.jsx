import { useState, useEffect } from 'react';

const countryCodes = [
  { code: '+966', name: 'السعودية' },
  { code: '+20', name: 'مصر' },
  { code: '+971', name: 'الإمارات' },
  { code: '+965', name: 'الكويت' },
  { code: '+974', name: 'قطر' },
  { code: '+973', name: 'البحرين' },
  { code: '+968', name: 'عُمان' },
  { code: '+', name: 'دولي آخر' },
];

export default function PhoneInputWithCountry({
  value = '',
  onChange,
  placeholder = '50 055 0223',
  required = false,
  disabled = false,
  className = '',
  id = 'phone-input',
}) {
  const [selectedCode, setSelectedCode] = useState('+966');
  const [localNumber, setLocalNumber] = useState('');

  // Synchronize initial or external value
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    const clean = String(value).trim();
    const matched = countryCodes.find((c) => c.code !== '+' && clean.startsWith(c.code));
    if (matched) {
      setSelectedCode(matched.code);
      setLocalNumber(clean.slice(matched.code.length));
    } else if (clean.startsWith('05')) {
      setSelectedCode('+966');
      setLocalNumber(clean.slice(1));
    } else if (clean.startsWith('+')) {
      setSelectedCode('+');
      setLocalNumber(clean.slice(1));
    } else {
      setLocalNumber(clean);
    }
  }, [value]);

  const handleCodeChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    const full = code === '+' ? `+${localNumber.replace(/\D/g, '')}` : `${code}${localNumber.replace(/\D/g, '')}`;
    if (onChange) onChange(full);
  };

  const handleNumberChange = (e) => {
    const rawDigits = e.target.value.replace(/[^\d]/g, '');
    setLocalNumber(rawDigits);
    const full = selectedCode === '+' ? `+${rawDigits}` : `${selectedCode}${rawDigits}`;
    if (onChange) onChange(full);
  };

  return (
    <div className={`flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:ring-1 focus-within:ring-emerald-800 focus-within:border-emerald-800 transition ${className}`}>
      <select
        value={selectedCode}
        onChange={handleCodeChange}
        disabled={disabled}
        aria-label="مفتاح الدولة"
        className="px-2.5 py-2 bg-slate-50 border-l border-slate-200 text-slate-700 text-xs font-mono font-bold focus:outline-none cursor-pointer hover:bg-slate-100 transition"
        dir="ltr"
      >
        {countryCodes.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
      <input
        type="tel"
        id={id}
        value={localNumber}
        onChange={handleNumberChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        dir="ltr"
        className="w-full px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
      />
    </div>
  );
}
