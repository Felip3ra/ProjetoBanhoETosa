export interface DayCellProps {
  day: {
    date: string;
    day: number;
    count: number;
    revenue: number;
  };
  selectedDate: string;
  onSelectDate: (date: string) => void;
}