// Admin component types

export interface StatCard {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface BadgeVariant {
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
}

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export interface AdminTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}