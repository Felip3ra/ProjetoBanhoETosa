export interface CalendarGridProps {
  days: any[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}