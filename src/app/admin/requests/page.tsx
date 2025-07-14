'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import '@/styles/admin/admin-common.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';
import { 
  AdminStatsCard, 
  AdminSearchBar, 
  AdminBadge, 
  AdminFilter, 
  AdminPagination,
  AdminTable,
  StatusBadge 
} from '@/components/admin';
import { TableColumn, FilterOption } from '@/types/admin';

interface Bid {
  id: number;
  developerId: number;
  amount: number;
  message: string;
  createdAt: string;
  developerName?: string;
  developerEmail?: string;
}

interface Request {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: 'FIXED_PRICE' | 'AUCTION';
  budget?: number;
  deadline: string;
  status: 'OPEN' | 'COMPLETED' | 'CLOSED';
  isUrgent: boolean;
  category: string;
  technologies: string[];
  createdAt: string;
  userName?: string;
  userEmail?: string;
  bidCount?: number;
  totalBidAmount?: number;
  bids?: Bid[];
  selectedBidId?: number;
}

export default function AdminRequestsPage() {
  const { showToast } = useUIStore();
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    urgent: 0,
    auction: 0
  });

  useEffect(() => {
    fetchRequests();
  }, [currentPage, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        sortBy: 'id',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/requests?${params}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      
      const data = await res.json();
      setRequests(data.requests);
      setTotalPages(data.pagination.totalPages);
      
      // Calculate stats
      const allRequests = data.requests;
      setStats({
        total: data.pagination.totalItems || allRequests.length,
        open: allRequests.filter((r: Request) => r.status === 'OPEN').length,
        urgent: allRequests.filter((r: Request) => r.isUrgent).length,
        auction: allRequests.filter((r: Request) => r.type === 'AUCTION').length
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      showToast('요청 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetail = async (requestId: number) => {
    try {
      const res = await fetch(`/api/v1/admin/requests/${requestId}`);
      if (!res.ok) throw new Error('Failed to fetch request detail');
      
      const data = await res.json();
      setSelectedRequest(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching request detail:', error);
      showToast('요청 상세 정보를 불러오는데 실패했습니다', 'error');
    }
  };

  const handleRequestAction = async (requestId: number, action: string, actionData?: any) => {
    try {
      const res = await fetch(`/api/v1/admin/requests/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: actionData })
      });

      if (!res.ok) throw new Error('Failed to update request');
      
      const data = await res.json();
      showToast(data.message, 'success');
      fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error updating request:', error);
      showToast('요청 업데이트에 실패했습니다', 'error');
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('정말로 이 요청을 삭제하시겠습니까? 관련된 모든 입찰 정보도 삭제됩니다.')) return;

    try {
      const res = await fetch(`/api/v1/admin/requests/${requestId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete request');
      
      showToast('요청이 삭제되었습니다', 'success');
      fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting request:', error);
      showToast('요청 삭제에 실패했습니다', 'error');
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const typeOptions: FilterOption[] = [
    { value: '', label: '전체 유형' },
    { value: 'FIXED_PRICE', label: '고정가격' },
    { value: 'AUCTION', label: '경매' }
  ];

  const statusOptions: FilterOption[] = [
    { value: '', label: '전체 상태' },
    { value: 'OPEN', label: '진행 중' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'CLOSED', label: '종료' }
  ];

  const columns: TableColumn<Request>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { 
      key: 'title', 
      header: '제목',
      render: (_, request) => (
        <Link 
          href={`/requests/${request.id}`}
          target="_blank"
          className={styles.requestLink}
        >
          {request.title}
        </Link>
      )
    },
    { 
      key: 'userId', 
      header: '요청자',
      render: (_, request) => (
        <div className={styles.userInfo}>
          <span>{request.userName}</span>
          <span className={styles.userEmail}>{request.userEmail}</span>
        </div>
      )
    },
    { 
      key: 'type', 
      header: '유형',
      render: (type) => type === 'FIXED_PRICE' 
        ? <AdminBadge variant="info">고정가격</AdminBadge>
        : <AdminBadge variant="warning">경매</AdminBadge>
    },
    { 
      key: 'budget', 
      header: '예산/입찰',
      render: (_, request) => request.type === 'FIXED_PRICE' 
        ? <AdminBadge variant="secondary">{request.budget?.toLocaleString()}P</AdminBadge>
        : <span>{request.bidCount || 0}개 입찰</span>
    },
    { 
      key: 'status', 
      header: '상태',
      render: (status) => {
        switch(status) {
          case 'OPEN': return StatusBadge.open();
          case 'COMPLETED': return StatusBadge.completed();
          case 'CLOSED': return StatusBadge.closed();
          default: return <AdminBadge>{status}</AdminBadge>;
        }
      }
    },
    { 
      key: 'deadline', 
      header: '마감일',
      render: (deadline) => formatDate(deadline)
    },
    { 
      key: 'isUrgent', 
      header: '긴급',
      render: (isUrgent) => isUrgent ? <span className={styles.urgentBadge}>🚨 긴급</span> : '-'
    },
    { 
      key: 'actions', 
      header: '액션',
      render: (_, request) => (
        <button
          className={styles.detailButton}
          onClick={(e) => {
            e.stopPropagation();
            fetchRequestDetail(request.id);
          }}
        >
          상세보기
        </button>
      )
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>요청 관리</h1>
        <p className="admin-subtitle">
          모든 개발 요청을 관리하고 분쟁을 해결할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <AdminStatsCard
          title="전체 요청"
          value={stats.total}
          icon="📋"
        />
        <AdminStatsCard
          title="진행 중"
          value={stats.open}
          icon="🔄"
        />
        <AdminStatsCard
          title="긴급 요청"
          value={stats.urgent}
          icon="🚨"
        />
        <AdminStatsCard
          title="경매 요청"
          value={stats.auction}
          icon="🏷️"
        />
      </div>

      {/* Search and Filters */}
      <div className="admin-controls">
        <AdminSearchBar
          placeholder="제목, 설명, 사용자명으로 검색..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onRefresh={fetchRequests}
        />
        
        <AdminFilter
          options={typeOptions}
          value={typeFilter}
          onChange={(value) => {
            setTypeFilter(value);
            setCurrentPage(1);
          }}
        />
        
        <AdminFilter
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Requests Table */}
      <AdminTable
        columns={columns}
        data={requests}
        loading={loading}
        emptyMessage="등록된 요청이 없습니다"
      />

      {/* Pagination */}
      {!loading && requests.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>요청 상세 정보</h2>
            
            <div className={styles.requestDetail}>
              <div className={styles.detailRow}>
                <label>제목:</label>
                <span>{selectedRequest.title}</span>
              </div>
              <div className={styles.detailRow}>
                <label>설명:</label>
                <p>{selectedRequest.description}</p>
              </div>
              <div className={styles.detailRow}>
                <label>요청자:</label>
                <span>{selectedRequest.userName} ({selectedRequest.userEmail})</span>
              </div>
              <div className={styles.detailRow}>
                <label>유형:</label>
                {selectedRequest.type === 'FIXED_PRICE' 
                  ? <AdminBadge variant="info">고정가격</AdminBadge>
                  : <AdminBadge variant="warning">경매</AdminBadge>
                }
              </div>
              <div className={styles.detailRow}>
                <label>예산:</label>
                <span>
                  {selectedRequest.type === 'FIXED_PRICE' 
                    ? `${selectedRequest.budget?.toLocaleString()}P`
                    : '경매 방식'
                  }
                </span>
              </div>
              <div className={styles.detailRow}>
                <label>상태:</label>
                {selectedRequest.status === 'OPEN' && StatusBadge.open()}
                {selectedRequest.status === 'COMPLETED' && StatusBadge.completed()}
                {selectedRequest.status === 'CLOSED' && StatusBadge.closed()}
              </div>
              <div className={styles.detailRow}>
                <label>마감일:</label>
                <span>{formatDate(selectedRequest.deadline)}</span>
              </div>
              {selectedRequest.isUrgent && (
                <div className={styles.detailRow}>
                  <label>긴급 요청:</label>
                  <span className={styles.urgentBadge}>🚨 긴급</span>
                </div>
              )}
            </div>

            {/* Bids Section (Admin can see all bid amounts) */}
            {selectedRequest.bids && selectedRequest.bids.length > 0 && (
              <div className={styles.bidsSection}>
                <h3>입찰 내역 ({selectedRequest.bids.length}개)</h3>
                <div className={styles.bidsList}>
                  {selectedRequest.bids.map(bid => (
                    <div key={bid.id} className={styles.bidItem}>
                      <div className={styles.bidInfo}>
                        <strong>{bid.developerName}</strong>
                        <span className={styles.bidAmount}>{bid.amount.toLocaleString()}P</span>
                      </div>
                      <p className={styles.bidMessage}>{bid.message}</p>
                      <span className={styles.bidDate}>{formatDate(bid.createdAt)}</span>
                      {selectedRequest.selectedBidId === bid.id && (
                        <span className={styles.selectedBadge}>✅ 선정됨</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.modalActions}>
              {selectedRequest.status === 'OPEN' && (
                <button 
                  className={styles.closeButton}
                  onClick={() => handleRequestAction(selectedRequest.id, 'close')}
                >
                  종료
                </button>
              )}
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteRequest(selectedRequest.id)}
              >
                🗑️ 삭제
              </button>
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