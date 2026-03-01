import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Props {
  tasks?: any[];
  onDateSelect: (date: Date | null) => void;
  onViewChange?: (date: Date) => void;
}

export default function TaskCalendar({
  tasks = [],
  onDateSelect,
  onViewChange,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix: Ensure calendar only renders on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // SAFE date comparison
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Handle calendar date change - properly typed for react-calendar
  const handleChange = (value: any) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0] ?? null);
      onDateSelect(value[0] ?? null);
    } else {
      setSelectedDate(value);
      onDateSelect(value);
    }
  };

  // Handle view change (when user navigates between months)
  const handleViewChange = (props: any) => {
    const { activeStartDate } = props;
    if (activeStartDate && onViewChange) {
      onViewChange(activeStartDate);
    }
  };

  const tileContent = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }) => {
    if (view !== "month") return null;

    const hasTask = tasks.some((task) => {
      if (!task?.dueDate) return false;

      const taskDate = new Date(task.dueDate);
      if (isNaN(taskDate.getTime())) return false;

      return isSameDay(taskDate, date);
    });

    return hasTask ? (
      <div className="flex justify-center mt-1 pointer-events-none">
        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
      </div>
    ) : null;
  };

  // Prevent overlay issues by ensuring client-side rendering
  if (!isClient) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-400 text-sm">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="react-calendar-wrapper [&_.react-calendar]:w-full [&_.react-calendar]:border-none [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile--active]:bg-primary [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile:hover]:bg-accent">
      <Calendar
        onChange={handleChange}
        onViewChange={handleViewChange}
        value={selectedDate}
        tileContent={tileContent}
        className="w-full"
      />
    </div>
  );
}
