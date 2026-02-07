import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarWidgetProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CalendarWidget = ({ onDateSelect, selectedDate }: CalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(
        <button
          key={i}
          onClick={() => onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected(i)
              ? 'bg-primary text-primary-content font-bold shadow-lg shadow-primary/30'
              : isToday(i)
                ? 'border border-primary text-primary font-bold'
                : 'hover:bg-base-200 text-base-content/80'
            }
          `}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg capitalize">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="btn btn-xs btn-ghost btn-circle">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="btn btn-xs btn-ghost btn-circle">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 place-items-center">
          {renderDays()}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
