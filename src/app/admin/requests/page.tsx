'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';

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
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
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
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, searchTerm, typeFilter, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/requests?${params}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      
      const data = await res.json();
      setRequests(data.requests);
      setTotalPages(data.pagination.totalPages);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className={`${styles.badge} ${styles.open}`}>진행 중</span>;
      case 'IN_PROGRESS':
        return <span className={`${styles.badge} ${styles.inProgress}`}>작업 중</span>;
      case 'COMPLETED':
        return <span className={`${styles.badge} ${styles.completed}`}>완료</span>;
      case 'CLOSED':
        return <span className={`${styles.badge} ${styles.closed}`}>종료</span>;
      case 'CANCELLED':
        return <span className={`${styles.badge} ${styles.cancelled}`}>취소됨</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'FIXED_PRICE' 
      ? <span className={`${styles.typeBadge} ${styles.fixed}`}>고정가격</span>
      : <span className={`${styles.typeBadge} ${styles.auction}`}>경매</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>요청 관리</h1>
        <p className={styles.subtitle}>
          모든 개발 요청을 관리하고 분쟁을 해결할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsCards}>
        <div className={styles.statCard}>
          <h3>전체 요청</h3>
          <p>{requests.length || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>진행 중</h3>
          <p>{requests.filter(r => r.status === 'OPEN').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>긴급 요청</h3>
          <p>{requests.filter(r => r.isUrgent).length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>경매 요청</h3>
          <p>{requests.filter(r => r.type === 'AUCTION').length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="제목, 설명, 사용자명으로 검색..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        
        <select
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">전체 유형</option>
          <option value="FIXED_PRICE">고정가격</option>
          <option value="AUCTION">경매</option>
        </select>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">전체 상태</option>
          <option value="OPEN">진행 중</option>
          <option value="IN_PROGRESS">작업 중</option>
          <option value="COMPLETED">완료</option>
          <option value="CLOSED">종료</option>
          <option value="CANCELLED">취소됨</option>
        </select>

        <button 
          className={styles.refreshButton}
          onClick={fetchRequests}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>요청 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>제목</th>
                  <th>요청자</th>
                  <th>유형</th>
                  <th>예산/입찰</th>
                  <th>상태</th>
                  <th>마감일</th>
                  <th>긴급</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>
                      <Link 
                        href={`/requests/${request.id}`}
                        target="_blank"
                        className={styles.requestLink}
                      >
                        {request.title}
                      </Link>
                    </td>
                    <td>
                      <div className={styles.userInfo}>
                        <span>{request.userName}</span>
                        <span className={styles.userEmail}>{request.userEmail}</span>
                      </div>
                    </td>
                    <td>{getTypeBadge(request.type)}</td>
                    <td>
                      {request.type === 'FIXED_PRICE' 
                        ? `${request.budget?.toLocaleString()}P`
                        : `${request.bidCount || 0}개 입찰`
                      }
                    </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDate(request.deadline)}</td>
                    <td>
                      {request.isUrgent && <span className={styles.urgentBadge}>🚨 긴급</span>}
                    </td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => fetchRequestDetail(request.id)}
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
                {getTypeBadge(selectedRequest.type)}
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
                {getStatusBadge(selectedRequest.status)}
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
                <>
                  <button 
                    className={styles.closeButton}
                    onClick={() => handleRequestAction(selectedRequest.id, 'close')}
                  >
                    종료
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleRequestAction(selectedRequest.id, 'cancel')}
                  >
                    취소
                  </button>
                </>
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