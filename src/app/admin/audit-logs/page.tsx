'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import '@/styles/admin/admin-common.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';
import { AuditLog, AuditAction } from '@/types/audit.types';
import { getActionDescription } from '@/lib/audit/actionDescriptions';
import { 
  AdminSearchBar, 
  AdminBadge, 
  AdminFilter, 
  AdminPagination,
  AdminTable
} from '@/components/admin';
import { TableColumn, FilterOption } from '@/types/admin';

export default function AdminAuditLogsPage() {
  const { showToast } = useUIStore();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
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

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const getActionBadgeVariant = (action: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
    if (action.includes('DELETE')) return 'danger';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'warning';
    if (action.includes('APPROVE') || action.includes('FEATURE')) return 'success';
    if (action.includes('REJECT') || action.includes('CANCEL')) return 'danger';
    return 'info';
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

  const actionOptions: FilterOption[] = [
    { value: '', label: '모든 액션' },
    { value: AuditAction.USER_UPDATE, label: '사용자 정보 수정' },
    { value: AuditAction.USER_DELETE, label: '사용자 삭제' },
    { value: AuditAction.USER_ROLE_CHANGE, label: '역할 변경' },
    { value: AuditAction.USER_BALANCE_CHANGE, label: '잔액 변경' },
    { value: AuditAction.MODULE_APPROVE, label: '모듈 승인' },
    { value: AuditAction.MODULE_REJECT, label: '모듈 거부' },
    { value: AuditAction.MODULE_DELETE, label: '모듈 삭제' },
    { value: AuditAction.MODULE_FEATURE, label: '모듈 추천' },
    { value: AuditAction.REQUEST_CLOSE, label: '요청 종료' },
    { value: AuditAction.REQUEST_CANCEL, label: '요청 취소' },
    { value: AuditAction.REQUEST_DELETE, label: '요청 삭제' },
    { value: AuditAction.TRANSACTION_REFUND, label: '환불 처리' }
  ];

  const entityOptions: FilterOption[] = [
    { value: '', label: '모든 엔티티' },
    { value: 'user', label: '사용자' },
    { value: 'module', label: '모듈' },
    { value: 'request', label: '요청' },
    { value: 'transaction', label: '거래' },
    { value: 'system', label: '시스템' }
  ];

  const columns: TableColumn<AuditLog>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { 
      key: 'createdAt', 
      header: '시간',
      render: (date) => formatDate(date)
    },
    { 
      key: 'adminEmail', 
      header: '관리자',
      render: (_, log) => (
        <div className={styles.adminInfo}>
          <span>{log.adminEmail}</span>
          <span className={styles.adminId}>ID: {log.adminId}</span>
        </div>
      )
    },
    { 
      key: 'action', 
      header: '액션',
      render: (action) => (
        <AdminBadge variant={getActionBadgeVariant(action)}>
          {getActionDescription(action)}
        </AdminBadge>
      )
    },
    { 
      key: 'entity', 
      header: '대상',
      render: (_, log) => (
        <div className={styles.entityInfo}>
          <span className={styles.entityIcon}>{getEntityIcon(log.entity)}</span>
          <span>{log.entity}</span>
          {log.entityId && <span className={styles.entityId}>{log.entityId}</span>}
        </div>
      )
    },
    { 
      key: 'ipAddress', 
      header: 'IP 주소',
      render: (ip) => <span className={styles.ipAddress}>{ip || '-'}</span>
    },
    { 
      key: 'actions', 
      header: '상세',
      render: (_, log) => (
        <button
          className={styles.detailButton}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(log);
            setShowDetailModal(true);
          }}
        >
          보기
        </button>
      )
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>감사 로그</h1>
        <p className="admin-subtitle">
          관리자의 모든 활동 내역을 추적하고 모니터링합니다
        </p>
      </div>

      {/* Filters */}
      <div className="admin-controls">
        <AdminSearchBar
          placeholder="이메일, 액션, 상세 내용으로 검색..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onRefresh={fetchAuditLogs}
        />
        
        <AdminFilter
          options={actionOptions}
          value={actionFilter}
          onChange={(value) => {
            setActionFilter(value);
            setCurrentPage(1);
          }}
        />
        
        <AdminFilter
          options={entityOptions}
          value={entityFilter}
          onChange={(value) => {
            setEntityFilter(value);
            setCurrentPage(1);
          }}
        />

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
      </div>

      {/* Audit Logs Table */}
      <AdminTable
        columns={columns}
        data={logs}
        loading={loading}
        emptyMessage="감사 로그가 없습니다"
      />

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
                <AdminBadge variant={getActionBadgeVariant(selectedLog.action)}>
                  {getActionDescription(selectedLog.action)}
                </AdminBadge>
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