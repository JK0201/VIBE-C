'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import '@/styles/admin/admin-common.css';
import useUIStore from '@/stores/useUIStore';
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

interface Module {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  githubUrl: string;
  rating: number;
  purchases: number;
  developer?: string;
  developerId?: number;
  imageUrl?: string;
  status?: string;
  reports?: number;
  createdAt?: string;
}

const categoryMap: { [key: string]: string } = {
  'website': '웹사이트',
  'mobile': '모바일 앱',
  'ecommerce': '이커머스',
  'ai': 'AI/ML',
  'backend': '백엔드/API',
  'blockchain': '블록체인',
  'data': '데이터 분석',
  'devops': 'DevOps'
};

export default function AdminModulesPage() {
  const { showToast } = useUIStore();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchModules();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
        sortBy: 'id',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/modules?${params}`);
      if (!res.ok) throw new Error('Failed to fetch modules');
      
      const data = await res.json();
      setModules(data.modules);
      setTotalPages(data.pagination.totalPages);
      
      // Calculate stats
      const allModules = data.modules;
      setStats({
        total: data.pagination.totalItems || allModules.length,
        approved: allModules.filter((m: Module) => m.status === 'approved').length,
        pending: allModules.filter((m: Module) => m.status === 'pending').length,
        rejected: allModules.filter((m: Module) => m.status === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching modules:', error);
      showToast('모듈 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleAction = async (moduleId: number, action: string) => {
    try {
      const res = await fetch(`/api/v1/admin/modules/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!res.ok) throw new Error('Failed to update module');
      
      const data = await res.json();
      showToast(data.message, 'success');
      fetchModules();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error updating module:', error);
      showToast('모듈 업데이트에 실패했습니다', 'error');
    }
  };

  const fetchModuleDetail = async (moduleId: number) => {
    try {
      const res = await fetch(`/api/v1/admin/modules/${moduleId}`);
      if (!res.ok) throw new Error('Failed to fetch module detail');
      
      const data = await res.json();
      setSelectedModule(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching module detail:', error);
      showToast('모듈 상세 정보를 불러오는데 실패했습니다', 'error');
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('정말로 이 모듈을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/v1/admin/modules/${moduleId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete module');
      
      showToast('모듈이 삭제되었습니다', 'success');
      fetchModules();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting module:', error);
      showToast('모듈 삭제에 실패했습니다', 'error');
    }
  };

  const categoryOptions: FilterOption[] = [
    { value: '', label: '전체 카테고리' },
    ...Object.entries(categoryMap).map(([value, label]) => ({ value, label }))
  ];

  const statusOptions: FilterOption[] = [
    { value: '', label: '전체 상태' },
    { value: 'approved', label: '승인됨' },
    { value: 'pending', label: '검토 중' },
    { value: 'rejected', label: '거부됨' }
  ];

  const columns: TableColumn<Module>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { 
      key: 'name', 
      header: '모듈명',
      render: (_, module) => {
        // Only approved modules should be clickable
        if (!module.status || module.status === 'approved') {
          return (
            <Link 
              href={`/marketplace/${module.id}`}
              target="_blank"
              className={styles.moduleLink}
            >
              {module.name}
            </Link>
          );
        }
        // Pending and rejected modules are not clickable
        return <span className={styles.moduleName}>{module.name}</span>;
      }
    },
    { 
      key: 'category', 
      header: '카테고리',
      render: (category) => <AdminBadge variant="info">{categoryMap[category] || category}</AdminBadge>
    },
    { 
      key: 'price', 
      header: '가격',
      render: (price) => <AdminBadge variant="secondary">{price.toLocaleString()}P</AdminBadge>
    },
    { 
      key: 'developer', 
      header: '개발자',
      render: (developer) => developer || '-'
    },
    { 
      key: 'status', 
      header: '상태',
      render: (status) => {
        switch(status || 'approved') {
          case 'approved': return StatusBadge.approved();
          case 'pending': return StatusBadge.pending();
          case 'rejected': return StatusBadge.rejected();
          default: return <AdminBadge>{status}</AdminBadge>;
        }
      }
    },
    { 
      key: 'rating', 
      header: '평점',
      render: (rating) => (
        <div className={styles.rating}>
          <span className={styles.star}>⭐</span> {rating.toFixed(1)}
        </div>
      )
    },
    { 
      key: 'purchases', 
      header: '판매',
      render: (purchases) => purchases.toLocaleString()
    },
    { 
      key: 'reports', 
      header: '신고',
      render: (reports, module) => 
        module.status === 'rejected' ? '-' : (
          reports && reports > 0 ? (
            <span className={styles.reportCount}>🚨 {reports}</span>
          ) : '-'
        )
    },
    { 
      key: 'actions', 
      header: '액션',
      render: (_, module) => (
        <button
          className={styles.detailButton}
          onClick={(e) => {
            e.stopPropagation();
            fetchModuleDetail(module.id);
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
        <h1>모듈 관리</h1>
        <p className="admin-subtitle">
          마켓플레이스에 등록된 모든 모듈을 관리할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <AdminStatsCard
          title="전체 모듈"
          value={stats.total}
          icon="📦"
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
          placeholder="모듈명, 개발자명으로 검색..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onRefresh={fetchModules}
        />
        
        <AdminFilter
          options={categoryOptions}
          value={categoryFilter}
          onChange={(value) => {
            setCategoryFilter(value);
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

      {/* Modules Table */}
      <AdminTable
        columns={columns}
        data={modules}
        loading={loading}
        emptyMessage="등록된 모듈이 없습니다"
      />

      {/* Pagination */}
      {!loading && modules.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedModule && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>모듈 상세 정보</h2>
            
            <div className={styles.moduleDetail}>
              <div className={styles.detailRow}>
                <label>모듈명:</label>
                <span>{selectedModule.name}</span>
              </div>
              <div className={styles.detailRow}>
                <label>설명:</label>
                <p>{selectedModule.description}</p>
              </div>
              <div className={styles.detailRow}>
                <label>카테고리:</label>
                <span>{categoryMap[selectedModule.category] || selectedModule.category}</span>
              </div>
              <div className={styles.detailRow}>
                <label>가격:</label>
                <span>{selectedModule.price.toLocaleString()}P</span>
              </div>
              <div className={styles.detailRow}>
                <label>개발자:</label>
                <span>{selectedModule.developer || '-'}</span>
              </div>
              <div className={styles.detailRow}>
                <label>GitHub URL:</label>
                <a href={selectedModule.githubUrl} target="_blank" rel="noopener noreferrer">
                  {selectedModule.githubUrl}
                </a>
              </div>
              <div className={styles.detailRow}>
                <label>평점:</label>
                <span>⭐ {selectedModule.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className={styles.detailRow}>
                <label>판매량:</label>
                <span>{selectedModule.purchases}회</span>
              </div>
              <div className={styles.detailRow}>
                <label>태그:</label>
                <div className={styles.tags}>
                  {selectedModule.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.detailRow}>
                <label>상태:</label>
                {selectedModule.status === 'approved' && StatusBadge.approved()}
                {selectedModule.status === 'pending' && StatusBadge.pending()}
                {selectedModule.status === 'rejected' && StatusBadge.rejected()}
                {!selectedModule.status && StatusBadge.approved()}
              </div>
              <div className={styles.detailRow}>
                <label>신고 횟수:</label>
                <span className={selectedModule.reports && selectedModule.reports > 0 ? styles.reportCount : ''}>
                  {selectedModule.reports && selectedModule.reports > 0 ? '🚨 ' : ''}
                  {selectedModule.reports || 0}건
                </span>
              </div>
            </div>

            <div className={styles.modalActions}>
              {selectedModule.status !== 'approved' && (
                <button 
                  className={styles.approveButton}
                  onClick={() => handleModuleAction(selectedModule.id, 'approve')}
                >
                  승인
                </button>
              )}
              {selectedModule.status !== 'rejected' && (
                <button 
                  className={styles.rejectButton}
                  onClick={() => handleModuleAction(selectedModule.id, 'reject')}
                >
                  거부
                </button>
              )}
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteModule(selectedModule.id)}
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