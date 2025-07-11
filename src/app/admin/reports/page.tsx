'use client';

import { useState } from 'react';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';

interface ReportData {
  title: string;
  period: string;
  summary: any;
  data: any[];
}

export default function AdminReportsPage() {
  const { showToast } = useUIStore();
  
  const [reportType, setReportType] = useState('users');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string>('');

  const reportTypes = [
    { value: 'users', label: '사용자 가입 리포트', icon: '👥' },
    { value: 'modules', label: '모듈 등록 리포트', icon: '📦' },
    { value: 'transactions', label: '거래 내역 리포트', icon: '💰' },
    { value: 'revenue', label: '수익 분석 리포트', icon: '📈' },
  ];

  const generateReport = async () => {
    if (!dateFrom || !dateTo) {
      showToast('날짜 범위를 선택해주세요', 'error');
      return;
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      showToast('시작일이 종료일보다 늦을 수 없습니다', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, dateFrom, dateTo })
      });

      if (!res.ok) throw new Error('Failed to generate report');
      
      const data = await res.json();
      setReportData(data.report);
      setGeneratedAt(data.generatedAt);
      showToast('리포트가 생성되었습니다', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('리포트 생성에 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${reportType}_report_${dateFrom}_${dateTo}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>리포트 생성</h1>
        <p className={styles.subtitle}>
          다양한 통계 리포트를 생성하고 다운로드할 수 있습니다
        </p>
      </div>

      {/* Report Configuration */}
      <div className={styles.configSection}>
        <h2>리포트 설정</h2>
        
        <div className={styles.configGrid}>
          <div className={styles.configItem}>
            <label>리포트 유형</label>
            <select
              className={styles.select}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.configItem}>
            <label>시작일</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className={styles.configItem}>
            <label>종료일</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className={styles.configItem}>
            <button
              className={styles.generateButton}
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? '생성 중...' : '리포트 생성'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <div className={styles.reportSection}>
          <div className={styles.reportHeader}>
            <div>
              <h2>{reportData.title}</h2>
              <p className={styles.reportPeriod}>{reportData.period}</p>
              <p className={styles.generatedAt}>생성 시간: {new Date(generatedAt).toLocaleString('ko-KR')}</p>
            </div>
            <button className={styles.downloadButton} onClick={downloadReport}>
              📥 다운로드
            </button>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <h3>요약</h3>
            <div className={styles.summaryGrid}>
              {Object.entries(reportData.summary).map(([key, value]) => (
                <div key={key} className={styles.summaryCard}>
                  <label>{getSummaryLabel(key)}</label>
                  <p>{formatSummaryValue(key, value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className={styles.dataSection}>
            <h3>상세 데이터</h3>
            <div className={styles.tableContainer}>
              {reportType === 'users' && renderUsersTable(reportData.data)}
              {reportType === 'modules' && renderModulesTable(reportData.data)}
              {reportType === 'transactions' && renderTransactionsTable(reportData.data)}
              {reportType === 'revenue' && renderRevenueTable(reportData.data)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getSummaryLabel(key: string): string {
    const labels: { [key: string]: string } = {
      totalUsers: '총 사용자',
      developers: '개발자',
      admins: '관리자',
      regularUsers: '일반 사용자',
      totalBalance: '총 잔액',
      totalModules: '총 모듈',
      totalSales: '총 판매량',
      totalRevenue: '총 매출',
      averageRating: '평균 평점',
      totalTransactions: '총 거래',
      totalVolume: '총 거래액',
      totalFees: '총 수수료',
      netRevenue: '순수익',
      dailyAverage: '일평균',
      totalRefunds: '총 환불',
      categoryBreakdown: '카테고리별',
      transactionsByType: '유형별 거래',
      volumeByType: '유형별 거래액'
    };
    return labels[key] || key;
  }

  function formatSummaryValue(key: string, value: any): string {
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${formatNumber(v as number)}`)
        .join(', ');
    }
    if (key.includes('Balance') || key.includes('Revenue') || key.includes('Volume') || 
        key.includes('Fees') || key.includes('Amount') || key === 'dailyAverage') {
      return `${formatNumber(value)}P`;
    }
    if (key === 'averageRating') {
      return value.toFixed(1);
    }
    return formatNumber(value);
  }

  function renderUsersTable(data: any[]) {
    return (
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>역할</th>
            <th>잔액</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.nickname}</td>
              <td>{user.role}</td>
              <td>{formatNumber(user.balance)}P</td>
              <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderModulesTable(data: any[]) {
    return (
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>모듈명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>판매량</th>
            <th>평점</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {data.map(module => (
            <tr key={module.id}>
              <td>{module.id}</td>
              <td>{module.name}</td>
              <td>{module.category}</td>
              <td>{formatNumber(module.price)}P</td>
              <td>{module.purchases}</td>
              <td>⭐ {module.rating}</td>
              <td>{new Date(module.createdAt).toLocaleDateString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderTransactionsTable(data: any[]) {
    return (
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>유형</th>
            <th>금액</th>
            <th>수수료</th>
            <th>실수령액</th>
            <th>상태</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {data.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>{formatNumber(transaction.amount)}P</td>
              <td>{formatNumber(transaction.fee)}P</td>
              <td>{formatNumber(transaction.netAmount)}P</td>
              <td>{transaction.status}</td>
              <td>{new Date(transaction.createdAt).toLocaleDateString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderRevenueTable(data: any[]) {
    return (
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>날짜</th>
            <th>모듈 판매</th>
            <th>요청 결제</th>
            <th>수수료</th>
            <th>환불</th>
            <th>순수익</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{formatNumber(row.moduleSales)}P</td>
              <td>{formatNumber(row.requestPayments)}P</td>
              <td>{formatNumber(row.fees)}P</td>
              <td>-{formatNumber(row.refunds)}P</td>
              <td className={styles.netRevenue}>
                {formatNumber(row.fees - row.refunds)}P
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}