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
  recruitmentStatus: 'OPEN' | 'COMPLETED' | 'CLOSED';
  status: 'approved' | 'pending' | 'rejected';
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
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

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
      
      // Calculate stats
      const allTesters = data.testers;
      setStats({
        total: data.pagination.totalItems || allTesters.length,
        approved: allTesters.filter((t: Tester) => t.status === 'approved').length,
        pending: allTesters.filter((t: Tester) => t.status === 'pending').length,
        rejected: allTesters.filter((t: Tester) => t.status === 'rejected').length
      });
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

  const typeOptions: FilterOption[] = [
    { value: '', label: '전체 유형' },
    { value: 'functional', label: '기능 테스트' },
    { value: 'ui', label: 'UI/UX 테스트' },
    { value: 'performance', label: '성능 테스트' },
    { value: 'security', label: '보안 테스트' }
  ];

  const statusOptions: FilterOption[] = [
    { value: '', label: '전체 상태' },
    { value: 'approved', label: '승인됨' },
    { value: 'pending', label: '검토 중' },
    { value: 'rejected', label: '거부됨' }
  ];

  const getTestTypeBadges = (types: string[]) => {
    const typeMap: Record<string, { label: string; variant: 'primary' | 'warning' | 'danger' | 'info' }> = {
      functional: { label: '기능', variant: 'primary' },
      ui: { label: 'UI/UX', variant: 'warning' },
      performance: { label: '성능', variant: 'info' },
      security: { label: '보안', variant: 'danger' }
    };

    return (
      <>
        {types.map(type => {
          const config = typeMap[type] || { label: type, variant: 'secondary' as const };
          return <AdminBadge key={type} variant={config.variant}>{config.label}</AdminBadge>;
        })}
      </>
    );
  };

  const columns: TableColumn<Tester>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { 
      key: 'title', 
      header: '제목',
      render: (_, tester) => {
        // Only approved testers should be clickable
        if (tester.status === 'approved') {
          return (
            <Link 
              href={`/testers/${tester.id}`}
              target="_blank"
              className={styles.testerLink}
            >
              {tester.title}
            </Link>
          );
        }
        // Pending and rejected testers are not clickable
        return <span className={styles.testerName}>{tester.title}</span>;
      }
    },
    { key: 'company', header: '회사' },
    { 
      key: 'testType', 
      header: '테스트 유형',
      render: (_, tester) => getTestTypeBadges(tester.testType)
    },
    { 
      key: 'recruitmentStatus', 
      header: '모집 상태',
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
      key: 'requiredTesters', 
      header: '모집인원',
      render: (count) => `${count}명`
    },
    { 
      key: 'applicants', 
      header: '지원자',
      render: (count) => `${count}명`
    },
    { 
      key: 'reward', 
      header: '보상',
      render: (reward) => <AdminBadge variant="secondary">{reward.toLocaleString()}P</AdminBadge>
    },
    { 
      key: 'duration', 
      header: '기간',
      render: (duration) => getDurationDisplay(duration)
    },
    { 
      key: 'status', 
      header: '승인 상태',
      render: (status) => {
        switch(status) {
          case 'approved': return StatusBadge.approved();
          case 'pending': return StatusBadge.pending();
          case 'rejected': return StatusBadge.rejected();
          default: return <AdminBadge>{status}</AdminBadge>;
        }
      }
    },
    { 
      key: 'isUrgent', 
      header: '긴급',
      render: (isUrgent) => isUrgent ? <span className={styles.urgentBadge}>🚨 긴급</span> : '-'
    },
    { 
      key: 'actions', 
      header: '액션',
      render: (_, tester) => (
        <button
          className={styles.detailButton}
          onClick={(e) => {
            e.stopPropagation();
            fetchTesterDetail(tester.id);
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
        <h1>테스터 관리</h1>
        <p className="admin-subtitle">
          모든 테스터 모집 공고를 관리하고 모니터링할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <AdminStatsCard
          title="전체 모집"
          value={stats.total}
          icon="🧪"
        />
        <AdminStatsCard
          title="승인됨"
          value={stats.approved}
          icon="✅"
        />
        <AdminStatsCard
          title="검토 중"
          value={stats.pending}
          icon="⏳"
        />
        <AdminStatsCard
          title="거부됨"
          value={stats.rejected}
          icon="❌"
        />
      </div>

      {/* Search and Filters */}
      <div className="admin-controls">
        <AdminSearchBar
          placeholder="제목, 회사명으로 검색..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onRefresh={fetchTesters}
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

      {/* Testers Table */}
      <AdminTable
        columns={columns}
        data={testers}
        loading={loading}
        emptyMessage="등록된 테스터 모집이 없습니다"
      />

      {/* Pagination */}
      {!loading && testers.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
                <div>{getTestTypeBadges(selectedTester.testType)}</div>
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
                <label>승인 상태:</label>
                {selectedTester.status === 'approved' && StatusBadge.approved()}
                {selectedTester.status === 'pending' && StatusBadge.pending()}
                {selectedTester.status === 'rejected' && StatusBadge.rejected()}
              </div>
              <div className={styles.detailRow}>
                <label>모집 상태:</label>
                {selectedTester.recruitmentStatus === 'OPEN' && StatusBadge.open()}
                {selectedTester.recruitmentStatus === 'COMPLETED' && StatusBadge.completed()}
                {selectedTester.recruitmentStatus === 'CLOSED' && StatusBadge.closed()}
              </div>
              {selectedTester.isUrgent && (
                <div className={styles.detailRow}>
                  <label>긴급 모집:</label>
                  <span className={styles.urgentBadge}>🚨 긴급</span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              {selectedTester.recruitmentStatus === 'OPEN' && (
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