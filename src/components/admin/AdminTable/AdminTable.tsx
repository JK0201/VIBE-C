import styles from './AdminTable.module.css';
import { AdminTableProps } from '@/types/admin';

interface ExtendedAdminTableProps<T> extends AdminTableProps<T> {
  className?: string;
}

export default function AdminTable<T extends { id: number | string }>({
  columns,
  data,
  loading = false,
  emptyMessage = "데이터가 없습니다",
  onRowClick,
  className
}: ExtendedAdminTableProps<T>) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                style={{ width: column.width, textAlign: column.align }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? styles.clickable : ''}
            >
              {columns.map((column) => (
                <td 
                  key={column.key}
                  style={{ textAlign: column.align }}
                >
                  {column.render 
                    ? column.render(row[column.key as keyof T], row)
                    : String(row[column.key as keyof T] ?? '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}