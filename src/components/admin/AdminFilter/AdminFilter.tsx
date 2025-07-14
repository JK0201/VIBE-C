import styles from './AdminFilter.module.css';
import { FilterOption } from '@/types/admin';

interface AdminFilterProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AdminFilter({
  options,
  value,
  onChange,
  placeholder = "전체",
  className
}: AdminFilterProps) {
  return (
    <select
      className={`${styles.filterSelect} ${className || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}