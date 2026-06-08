import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PeriodSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(parseInt(val))}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Today</SelectItem>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
        <SelectItem value="365">Last year</SelectItem>
      </SelectContent>
    </Select>
  );
}
