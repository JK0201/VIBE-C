'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';
import { AuditLog, AuditAction } from '@/types/audit.types';
import { getActionDescription } from '@/lib/audit/actionDescriptions';

export default function AdminAuditLogsPage() {
  const { showToast } = useUIStore();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, searchTerm, actionFilter, entityFilter, dateFrom, dateTo]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        action: actionFilter,
        entity: entityFilter,
        dateFrom,
        dateTo
      });

      const res = await fetch(`/api/v1/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      
      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      showToast('감사 로그를 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string): string => {
    if (action.includes('DELETE')) return styles.danger;
    if (action.includes('UPDATE') || action.includes('CHANGE')) return styles.warning;
    if (action.includes('APPROVE') || action.includes('FEATURE')) return styles.success;
    if (action.includes('REJECT') || action.includes('CANCEL')) return styles.error;
    return styles.info;
  };

  const getEntityIcon = (entity: string): string => {
    switch (entity) {
      case 'user': return '👤';
      case 'module': return '📦';
      case 'request': return '📝';
      case 'transaction': return '💰';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>감사 로그</h1>
        <p className={styles.subtitle}>
          관리자의 모든 활동 내역을 추적하고 모니터링합니다
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="이메일, 액션, 상세 내용으로 검색..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className={styles.filterSelect}
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">모든 액션</option>
          <optgroup label="사용자 관리">
            <option value={AuditAction.USER_UPDATE}>사용자 정보 수정</option>
            <option value={AuditAction.USER_DELETE}>사용자 삭제</option>
            <option value={AuditAction.USER_ROLE_CHANGE}>역할 변경</option>
            <option value={AuditAction.USER_BALANCE_CHANGE}>잔액 변경</option>
          </optgroup>
          <optgroup label="모듈 관리">
            <option value={AuditAction.MODULE_APPROVE}>모듈 승인</option>
            <option value={AuditAction.MODULE_REJECT}>모듈 거부</option>
            <option value={AuditAction.MODULE_DELETE}>모듈 삭제</option>
            <option value={AuditAction.MODULE_FEATURE}>모듈 추천</option>
          </optgroup>
          <optgroup label="요청 관리">
            <option value={AuditAction.REQUEST_CLOSE}>요청 종료</option>
            <option value={AuditAction.REQUEST_CANCEL}>요청 취소</option>
            <option value={AuditAction.REQUEST_DELETE}>요청 삭제</option>
          </optgroup>
          <optgroup label="거래 관리">
            <option value={AuditAction.TRANSACTION_REFUND}>환불 처리</option>
          </optgroup>
        </select>

        <select
          className={styles.filterSelect}
          value={entityFilter}
          onChange={(e) => {
            setEntityFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">모든 엔티티</option>
          <option value="user">사용자</option>
          <option value="module">모듈</option>
          <option value="request">요청</option>
          <option value="transaction">거래</option>
          <option value="system">시스템</option>
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
          onClick={fetchAuditLogs}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>감사 로그를 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>시간</th>
                  <th>관리자</th>
                  <th>액션</th>
                  <th>대상</th>
                  <th>IP 주소</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      <div className={styles.adminInfo}>
                        <span>{log.adminEmail}</span>
                        <span className={styles.adminId}>ID: {log.adminId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.actionBadge} ${getActionBadgeColor(log.action)}`}>
                        {getActionDescription(log.action)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.entityInfo}>
                        <span className={styles.entityIcon}>{getEntityIcon(log.entity)}</span>
                        <span>{log.entity}</span>
                        {log.entityId && <span className={styles.entityId}>{log.entityId}</span>}
                      </div>
                    </td>
                    <td className={styles.ipAddress}>{log.ipAddress || '-'}</td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetailModal(true);
                        }}
                      >
                        보기
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
      {showDetailModal && selectedLog && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>감사 로그 상세 정보</h2>
            
            <div className={styles.logDetail}>
              <div className={styles.detailRow}>
                <label>로그 ID:</label>
                <span>#{selectedLog.id}</span>
              </div>
              <div className={styles.detailRow}>
                <label>시간:</label>
                <span>{new Date(selectedLog.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <div className={styles.detailRow}>
                <label>관리자:</label>
                <span>{selectedLog.adminEmail} (ID: {selectedLog.adminId})</span>
              </div>
              <div className={styles.detailRow}>
                <label>액션:</label>
                <span className={`${styles.actionBadge} ${getActionBadgeColor(selectedLog.action)}`}>
                  {getActionDescription(selectedLog.action)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <label>대상:</label>
                <span>
                  {getEntityIcon(selectedLog.entity)} {selectedLog.entity}
                  {selectedLog.entityId && ` #${selectedLog.entityId}`}
                </span>
              </div>
              <div className={styles.detailRow}>
                <label>IP 주소:</label>
                <span>{selectedLog.ipAddress || '없음'}</span>
              </div>
              <div className={styles.detailRow}>
                <label>User Agent:</label>
                <span className={styles.userAgent}>{selectedLog.userAgent || '없음'}</span>
              </div>
              <div className={styles.detailRow}>
                <label>상세 정보:</label>
                <pre className={styles.detailJson}>
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className={styles.modalActions}>
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