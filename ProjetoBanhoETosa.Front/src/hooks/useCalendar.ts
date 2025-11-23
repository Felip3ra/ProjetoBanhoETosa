import { useState, useCallback } from "react";

interface UseCalendar {
  currentDate: Date;
  selectedDate: string;
  changeMonth: (offset: number) => void;
  generateMonthDays: (appointments: any[]) => any[];
  setSelectedDate: (date: string) => void;
}

export const useCalendar = (): UseCalendar => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const changeMonth = useCallback((offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  }, [currentDate]);

  const generateMonthDays = useCallback((appointments: any[]) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: any[] = [];

    // Fill with nulls for days before the 1st of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Fill with days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0];
      const dayAppointments = appointments.filter((a) => a.date === date);
      const totalRevenue = dayAppointments.reduce((acc, a) => acc + a.price, 0);

      days.push({ day, date, count: dayAppointments.length, revenue: totalRevenue });
    }

    return days;
  }, [currentDate, appointments]); // appointments is a dependency here because it's used to calculate count and revenue for each day

  return {
    currentDate,
    selectedDate,
    changeMonth,
    generateMonthDays,
    setSelectedDate,
  };
};
