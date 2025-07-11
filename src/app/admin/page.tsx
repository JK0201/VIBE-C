'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    activeToday: number;
  };
  modules: {
    total: number;
    pendingApproval: number;
    totalSales: number;
  };
  requests: {
    total: number;
    open: number;
    urgent: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayouts: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/v1/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Fetch recent activity
      const activityRes = await fetch('/api/v1/admin/activity?limit=10');
      if (activityRes.ok) {
        const data = await activityRes.json();
        setRecentActivity(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>대시보드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>관리자 대시보드</h1>
        <p className={styles.subtitle}>플랫폼 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3><span className={styles.inlineIcon}>👥</span> 전체 사용자</h3>
            <p className={styles.statNumber}>{stats?.users.total || 0}</p>
            <p className={styles.statChange}>
              이번 달 신규: {stats?.users.newThisMonth || 0}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3><span className={styles.inlineIcon}>📦</span> 등록 모듈</h3>
            <p className={styles.statNumber}>{stats?.modules.total || 0}</p>
            <p className={styles.statChange}>
              승인 대기: {stats?.modules.pendingApproval || 0}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3><span className={styles.inlineIcon}>📝</span> 개발 요청</h3>
            <p className={styles.statNumber}>{stats?.requests.total || 0}</p>
            <p className={styles.statChange}>
              진행 중: {stats?.requests.open || 0}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3><span className={styles.inlineIcon}>💰</span> 총 수익</h3>
            <p className={styles.statNumber}>
              {stats?.revenue.totalRevenue?.toLocaleString() || 0}P
            </p>
            <p className={styles.statChange}>
              이번 달: {stats?.revenue.monthlyRevenue?.toLocaleString() || 0}P
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2>빠른 작업</h2>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>🚨</span>
            신고 내역 확인
          </button>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>✅</span>
            모듈 승인
          </button>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>💸</span>
            정산 처리
          </button>
          <button className={styles.actionButton}>
            <span className={styles.buttonIcon}>📊</span>
            리포트 생성
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h2>최근 활동</h2>
        <div className={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon || '📌'}</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>{activity.description}</p>
                  <p className={styles.activityTime}>{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noActivity}>최근 활동이 없습니다.</p>
          )}
        </div>
      </div>

      {/* Charts Section (placeholder) */}
      <div className={styles.charts}>
        <div className={styles.chart}>
          <h3>월별 거래량</h3>
          <div className={styles.chartPlaceholder}>
            차트가 여기에 표시됩니다
          </div>
        </div>
        <div className={styles.chart}>
          <h3>카테고리별 모듈 분포</h3>
          <div className={styles.chartPlaceholder}>
            차트가 여기에 표시됩니다
          </div>
        </div>
      </div>
    </div>
  );
}