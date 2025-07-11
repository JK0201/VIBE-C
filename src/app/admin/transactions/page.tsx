'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';

interface Transaction {
  id: number;
  type: string;
  status: string;
  amount: number;
  fee: number;
  netAmount: number;
  fromUserId: number;
  toUserId: number;
  moduleId?: number | null;
  requestId?: number | null;
  description: string;
  createdAt: string;
  completedAt?: string | null;
}

interface TransactionStats {
  totalVolume: number;
  totalFees: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, typeFilter, statusFilter, dateFrom, dateTo]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        type: typeFilter,
        status: statusFilter,
        dateFrom,
        dateTo
      });

      const res = await fetch(`/api/v1/admin/transactions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      
      const data = await res.json();
      setTransactions(data.transactions);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showToast('거래 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (transactionId: number) => {
    const reason = prompt('환불 사유를 입력해주세요:');
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, reason })
      });

      if (!res.ok) throw new Error('Failed to process refund');
      
      const data = await res.json();
      showToast(data.message, 'success');
      fetchTransactions();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error processing refund:', error);
      showToast('환불 처리에 실패했습니다', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className={`${styles.badge} ${styles.completed}`}>완료</span>;
      case 'PENDING':
        return <span className={`${styles.badge} ${styles.pending}`}>대기 중</span>;
      case 'FAILED':
        return <span className={`${styles.badge} ${styles.failed}`}>실패</span>;
      case 'REFUNDED':
        return <span className={`${styles.badge} ${styles.refunded}`}>환불됨</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeStyles: { [key: string]: string } = {
      MODULE_PURCHASE: styles.purchase,
      REQUEST_PAYMENT: styles.payment,
      WITHDRAWAL: styles.withdrawal,
      DEPOSIT: styles.deposit,
      REFUND: styles.refund
    };

    return <span className={`${styles.typeBadge} ${typeStyles[type] || ''}`}>{type}</span>;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}P`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>거래 관리</h1>
        <p className={styles.subtitle}>
          모든 거래 내역을 확인하고 관리할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <h3>총 거래액</h3>
            <p className={styles.statAmount}>{formatCurrency(stats.totalVolume)}</p>
          </div>
          <div className={styles.statCard}>
            <h3>플랫폼 수수료</h3>
            <p className={styles.statAmount}>{formatCurrency(stats.totalFees)}</p>
          </div>
          <div className={styles.statCard}>
            <h3>완료된 거래</h3>
            <p className={styles.statCount}>{stats.completedCount}</p>
          </div>
          <div className={styles.statCard}>
            <h3>대기 중</h3>
            <p className={styles.statCount}>{stats.pendingCount}</p>
          </div>
          <div className={styles.statCard}>
            <h3>실패</h3>
            <p className={styles.statCount}>{stats.failedCount}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">모든 유형</option>
          <option value="MODULE_PURCHASE">모듈 구매</option>
          <option value="REQUEST_PAYMENT">요청 결제</option>
          <option value="WITHDRAWAL">출금</option>
          <option value="DEPOSIT">충전</option>
          <option value="REFUND">환불</option>
        </select>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">모든 상태</option>
          <option value="COMPLETED">완료</option>
          <option value="PENDING">대기 중</option>
          <option value="FAILED">실패</option>
          <option value="REFUNDED">환불됨</option>
        </select>

        <input
          type="date"
          className={styles.dateInput}
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="시작일"
        />

        <input
          type="date"
          className={styles.dateInput}
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="종료일"
        />

        <button 
          className={styles.refreshButton}
          onClick={fetchTransactions}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>거래 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>유형</th>
                  <th>설명</th>
                  <th>금액</th>
                  <th>수수료</th>
                  <th>실수령액</th>
                  <th>상태</th>
                  <th>날짜</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{getTypeBadge(transaction.type)}</td>
                    <td>{transaction.description}</td>
                    <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
                    <td className={styles.fee}>{formatCurrency(transaction.fee)}</td>
                    <td className={styles.netAmount}>{formatCurrency(transaction.netAmount)}</td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>{formatDate(transaction.createdAt)}</td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailModal(true);
                        }}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>거래 상세 정보</h2>
            
            <div className={styles.transactionDetail}>
              <div className={styles.detailRow}>
                <label>거래 ID:</label>
                <span>#{selectedTransaction.id}</span>
              </div>
              <div className={styles.detailRow}>
                <label>유형:</label>
                {getTypeBadge(selectedTransaction.type)}
              </div>
              <div className={styles.detailRow}>
                <label>설명:</label>
                <span>{selectedTransaction.description}</span>
              </div>
              <div className={styles.detailRow}>
                <label>금액:</label>
                <span className={styles.amount}>{formatCurrency(selectedTransaction.amount)}</span>
              </div>
              <div className={styles.detailRow}>
                <label>수수료:</label>
                <span className={styles.fee}>{formatCurrency(selectedTransaction.fee)}</span>
              </div>
              <div className={styles.detailRow}>
                <label>실수령액:</label>
                <span className={styles.netAmount}>{formatCurrency(selectedTransaction.netAmount)}</span>
              </div>
              <div className={styles.detailRow}>
                <label>상태:</label>
                {getStatusBadge(selectedTransaction.status)}
              </div>
              <div className={styles.detailRow}>
                <label>송신자 ID:</label>
                <span>User #{selectedTransaction.fromUserId}</span>
              </div>
              <div className={styles.detailRow}>
                <label>수신자 ID:</label>
                <span>User #{selectedTransaction.toUserId}</span>
              </div>
              {selectedTransaction.moduleId && (
                <div className={styles.detailRow}>
                  <label>모듈 ID:</label>
                  <span>Module #{selectedTransaction.moduleId}</span>
                </div>
              )}
              {selectedTransaction.requestId && (
                <div className={styles.detailRow}>
                  <label>요청 ID:</label>
                  <span>Request #{selectedTransaction.requestId}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <label>생성일:</label>
                <span>{formatDate(selectedTransaction.createdAt)}</span>
              </div>
              {selectedTransaction.completedAt && (
                <div className={styles.detailRow}>
                  <label>완료일:</label>
                  <span>{formatDate(selectedTransaction.completedAt)}</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              {selectedTransaction.status === 'COMPLETED' && 
               (selectedTransaction.type === 'MODULE_PURCHASE' || selectedTransaction.type === 'REQUEST_PAYMENT') && (
                <button 
                  className={styles.refundButton}
                  onClick={() => handleRefund(selectedTransaction.id)}
                >
                  💸 환불 처리
                </button>
              )}
              <button 
                className={styles.closeModalButton}
                onClick={() => setShowDetailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}