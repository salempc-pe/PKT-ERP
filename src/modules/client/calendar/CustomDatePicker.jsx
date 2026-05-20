import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

export default function CustomDatePicker({ selectedDate, onChange, onClose }) {
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date());
  
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  const handleMonthChange = (e) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };

  const selectDate = (day) => {
    const d = day < 10 ? `0${day}` : day;
    const m = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
    onChange(`${year}-${m}-${d}`);
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
    return sYear === year && sMonth === (month + 1) && sDay === day;
  };

  // Generar años (ej: de 2020 a 2030)
  const years = [];
  const startYear = Math.min(2020, year - 5);
  const endYear = Math.max(2035, year + 10);
  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }

  return (
    <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl p-4 w-[320px] animate-in zoom-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          <select 
            value={month} 
            onChange={handleMonthChange}
            className="bg-transparent text-[var(--color-on-surface)] text-xs font-bold outline-none cursor-pointer hover:text-[var(--color-primary)] transition-colors"
          >
            {months.map((m, i) => <option key={m} value={i} className="bg-[var(--color-surface-container)]">{m}</option>)}
          </select>
          <select 
            value={year} 
            onChange={handleYearChange}
            className="bg-transparent text-[var(--color-on-surface)] text-xs font-bold outline-none cursor-pointer hover:text-[var(--color-primary)] transition-colors"
          >
            {years.map(y => <option key={y} value={y} className="bg-[var(--color-surface-container)]">{y}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-[var(--color-surface-variant)] rounded-lg text-[var(--color-on-surface-variant)]">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-[var(--color-surface-variant)] rounded-lg text-[var(--color-on-surface-variant)]">
            <ChevronRight size={16} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-red-500/10 text-red-400 rounded-lg ml-2">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map(d => (
          <span key={d} className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] text-center opacity-40">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const selected = isSelected(day);
          const current = isToday(day);
          
          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              className={`
                h-9 w-9 text-xs font-bold rounded-xl transition-all
                ${selected 
                  ? 'bg-[#6B4FD8] text-[#001b5c] scale-110' 
                  : current
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                  : 'hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)]'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
