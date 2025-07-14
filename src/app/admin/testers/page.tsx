'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';
import { formatDate } from '@/lib/formatDate';

interface Tester {
  id: number;
  title: string;
  company: string;
  description: string;
  testType: string[];
  duration: string;
  requiredTesters: number;
  reward: number;
  requirements: string[];
  deadline: string;
  createdAt: string;
  applicants: number;
  isUrgent: boolean;
  status: 'OPEN' | 'COMPLETED' | 'CLOSED';
  images?: string[];
  userId?: number;
  userName?: string;
  userEmail?: string;
}

export default function AdminTestersPage() {
  const { showToast } = useUIStore();
  
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTester, setSelectedTester] = useState<Tester | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchTesters();
  }, [currentPage, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchTesters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        testType: typeFilter,
        status: statusFilter,
        sortBy: 'id',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/testers?${params}`);
      if (!res.ok) throw new Error('Failed to fetch testers');
      
      const data = await res.json();
      setTesters(data.testers);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching testers:', error);
      showToast('테스터 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTesterDetail = async (testerId: number) => {
    try {
      const res = await fetch(`/api/v1/admin/testers/${testerId}`);
      if (!res.ok) throw new Error('Failed to fetch tester detail');
      
      const data = await res.json();
      setSelectedTester(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching tester detail:', error);
      showToast('테스터 상세 정보를 불러오는데 실패했습니다', 'error');
    }
  };

  const handleTesterAction = async (testerId: number, action: string) => {
    try {
      const res = await fetch(`/api/v1/admin/testers/${testerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!res.ok) throw new Error('Failed to update tester');
      
      const data = await res.json();
      showToast(data.message, 'success');
      fetchTesters();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error updating tester:', error);
      showToast('테스터 업데이트에 실패했습니다', 'error');
    }
  };

  const handleDeleteTester = async (testerId: number) => {
    if (!confirm('정말로 이 테스터 모집을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/v1/admin/testers/${testerId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete tester');
      
      showToast('테스터 모집이 삭제되었습니다', 'success');
      fetchTesters();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting tester:', error);
      showToast('테스터 삭제에 실패했습니다', 'error');
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className={`${styles.badge} ${styles.open}`}>모집 중</span>;
      case 'COMPLETED':
        return <span className={`${styles.badge} ${styles.completed}`}>완료</span>;
      case 'CLOSED':
        return <span className={`${styles.badge} ${styles.closed}`}>종료</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  const getTestTypeBadge = (types: string[]) => {
    const typeMap: Record<string, string> = {
      functional: '기능',
      ui: 'UI/UX',
      performance: '성능',
      security: '보안'
    };

    return types.map(type => (
      <span key={type} className={`${styles.typeBadge} ${styles[type]}`}>
        {typeMap[type] || type}
      </span>
    ));
  };

  const getDurationDisplay = (duration: string) => {
    const durationMap: Record<string, string> = {
      '1week': '1주',
      '2weeks': '2주',
      '3weeks': '3주',
      '1month': '1개월',
      '2months': '2개월',
      '3months': '3개월'
    };
    return durationMap[duration] || duration;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>테스터 관리</h1>
        <p className={styles.subtitle}>
          모든 테스터 모집 공고를 관리하고 모니터링할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsCards}>
        <div className={styles.statCard}>
          <h3>전체 모집</h3>
          <p>{testers.length || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>모집 중</h3>
          <p>{testers.filter(t => t.status === 'OPEN').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>긴급 모집</h3>
          <p>{testers.filter(t => t.isUrgent).length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>보안 테스트</h3>
          <p>{testers.filter(t => t.testType.includes('security')).length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="제목, 회사명으로 검색..."
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
        
        <select
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">전체 유형</option>
          <option value="functional">기능 테스트</option>
          <option value="ui">UI/UX 테스트</option>
          <option value="performance">성능 테스트</option>
          <option value="security">보안 테스트</option>
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
          <option value="OPEN">모집 중</option>
          <option value="COMPLETED">완료</option>
          <option value="CLOSED">종료</option>
        </select>

        <button 
          className={styles.refreshButton}
          onClick={fetchTesters}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Testers Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>테스터 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>제목</th>
                  <th>회사</th>
                  <th>테스트 유형</th>
                  <th>보상</th>
                  <th>모집인원</th>
                  <th>지원자</th>
                  <th>기간</th>
                  <th>상태</th>
                  <th>긴급</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {testers.map(tester => (
                  <tr key={tester.id}>
                    <td>{tester.id}</td>
                    <td>
                      <Link 
                        href={`/testers/${tester.id}`}
                        target="_blank"
                        className={styles.testerLink}
                      >
                        {tester.title}
                      </Link>
                    </td>
                    <td>{tester.company}</td>
                    <td>{getTestTypeBadge(tester.testType)}</td>
                    <td>{tester.reward.toLocaleString()}P</td>
                    <td>{tester.requiredTesters}명</td>
                    <td>{tester.applicants}명</td>
                    <td>{getDurationDisplay(tester.duration)}</td>
                    <td>{getStatusBadge(tester.status)}</td>
                    <td>
                      {tester.isUrgent && <span className={styles.urgentBadge}>🚨 긴급</span>}
                    </td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => fetchTesterDetail(tester.id)}
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
      {showDetailModal && selectedTester && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>테스터 모집 상세 정보</h2>
            
            <div className={styles.testerDetail}>
              <div className={styles.detailRow}>
                <label>제목:</label>
                <span>{selectedTester.title}</span>
              </div>
              <div className={styles.detailRow}>
                <label>회사:</label>
                <span>{selectedTester.company}</span>
              </div>
              <div className={styles.detailRow}>
                <label>설명:</label>
                <p>{selectedTester.description}</p>
              </div>
              <div className={styles.detailRow}>
                <label>테스트 유형:</label>
                <div>{getTestTypeBadge(selectedTester.testType)}</div>
              </div>
              <div className={styles.detailRow}>
                <label>보상:</label>
                <span>{selectedTester.reward.toLocaleString()}P</span>
              </div>
              <div className={styles.detailRow}>
                <label>모집 인원:</label>
                <span>{selectedTester.requiredTesters}명</span>
              </div>
              <div className={styles.detailRow}>
                <label>현재 지원자:</label>
                <span>{selectedTester.applicants}명</span>
              </div>
              <div className={styles.detailRow}>
                <label>테스트 기간:</label>
                <span>{getDurationDisplay(selectedTester.duration)}</span>
              </div>
              <div className={styles.detailRow}>
                <label>요구사항:</label>
                <span>{selectedTester.requirements.join(', ')}</span>
              </div>
              <div className={styles.detailRow}>
                <label>마감일:</label>
                <span>{formatDate(selectedTester.deadline)}</span>
              </div>
              <div className={styles.detailRow}>
                <label>상태:</label>
                {getStatusBadge(selectedTester.status)}
              </div>
              {selectedTester.isUrgent && (
                <div className={styles.detailRow}>
                  <label>긴급 모집:</label>
                  <span className={styles.urgentBadge}>🚨 긴급</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              {selectedTester.status === 'OPEN' && (
                <button 
                  className={styles.closeButton}
                  onClick={() => handleTesterAction(selectedTester.id, 'close')}
                >
                  종료
                </button>
              )}
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteTester(selectedTester.id)}
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