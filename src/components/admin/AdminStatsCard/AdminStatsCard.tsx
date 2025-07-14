import styles from './AdminStatsCard.module.css';
import { StatCard } from '@/types/admin';

interface AdminStatsCardProps extends StatCard {
  className?: string;
}

export default function AdminStatsCard({ 
  title, 
  value, 
  icon, 
  trend,
  className 
}: AdminStatsCardProps) {
  return (
    <div className={`${styles.statCard} ${className || ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <p className={styles.value}>{value.toLocaleString()}</p>
      {trend && (
        <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
          <span className={styles.trendIcon}>
            {trend.isPositive ? '↑' : '↓'}
          </span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
}