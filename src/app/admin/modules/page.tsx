'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';

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
  featured?: boolean;
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
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchModules();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/modules?${params}`);
      if (!res.ok) throw new Error('Failed to fetch modules');
      
      const data = await res.json();
      setModules(data.modules);
      setTotalPages(data.pagination.totalPages);
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

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('정말로 이 모듈을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className={`${styles.badge} ${styles.approved}`}>승인됨</span>;
      case 'pending':
        return <span className={`${styles.badge} ${styles.pending}`}>검토 중</span>;
      case 'rejected':
        return <span className={`${styles.badge} ${styles.rejected}`}>거부됨</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>모듈 관리</h1>
        <p className={styles.subtitle}>
          등록된 모듈을 검토하고 관리할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsCards}>
        <div className={styles.statCard}>
          <h3>전체 모듈</h3>
          <p>{modules.length || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>검토 대기</h3>
          <p>{modules.filter(m => m.status === 'pending').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>신고 접수</h3>
          <p>{modules.reduce((sum, m) => sum + (m.reports || 0), 0)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>추천 모듈</h3>
          <p>{modules.filter(m => m.featured).length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="모듈명, 설명, 개발자로 검색..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        
        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">전체 카테고리</option>
          {Object.entries(categoryMap).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
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
          <option value="approved">승인됨</option>
          <option value="pending">검토 중</option>
          <option value="rejected">거부됨</option>
        </select>

        <button 
          className={styles.refreshButton}
          onClick={fetchModules}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Modules Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>모듈 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>모듈명</th>
                  <th>카테고리</th>
                  <th>가격</th>
                  <th>판매량</th>
                  <th>평점</th>
                  <th>상태</th>
                  <th>신고</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(module => (
                  <tr key={module.id}>
                    <td>{module.id}</td>
                    <td>
                      <div className={styles.moduleInfo}>
                        <Link 
                          href={`/marketplace/${module.id}`}
                          target="_blank"
                          className={styles.moduleLink}
                        >
                          {module.name}
                        </Link>
                        {module.featured && <span className={styles.featuredBadge}>⭐ 추천</span>}
                      </div>
                    </td>
                    <td>{categoryMap[module.category] || module.category}</td>
                    <td>{module.price.toLocaleString()}P</td>
                    <td>{module.purchases}</td>
                    <td>⭐ {module.rating}</td>
                    <td>{getStatusBadge(module.status || 'approved')}</td>
                    <td>
                      {module.reports && module.reports > 0 ? (
                        <span className={styles.reportCount}>🚨 {module.reports}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.detailButton}
                        onClick={() => {
                          setSelectedModule(module);
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
                <label>태그:</label>
                <div className={styles.tags}>
                  {selectedModule.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.detailRow}>
                <label>GitHub URL:</label>
                <a href={selectedModule.githubUrl} target="_blank" rel="noopener noreferrer">
                  {selectedModule.githubUrl}
                </a>
              </div>
              <div className={styles.detailRow}>
                <label>개발자:</label>
                <span>{selectedModule.developer || `User ${selectedModule.developerId}`}</span>
              </div>
              <div className={styles.detailRow}>
                <label>상태:</label>
                {getStatusBadge(selectedModule.status || 'approved')}
              </div>
            </div>

            <div className={styles.modalActions}>
              {selectedModule.status === 'pending' && (
                <>
                  <button 
                    className={styles.approveButton}
                    onClick={() => handleModuleAction(selectedModule.id, 'approve')}
                  >
                    ✅ 승인
                  </button>
                  <button 
                    className={styles.rejectButton}
                    onClick={() => handleModuleAction(selectedModule.id, 'reject')}
                  >
                    ❌ 거부
                  </button>
                </>
              )}
              {selectedModule.featured ? (
                <button 
                  className={styles.unfeatureButton}
                  onClick={() => handleModuleAction(selectedModule.id, 'unfeature')}
                >
                  ⭐ 추천 해제
                </button>
              ) : (
                <button 
                  className={styles.featureButton}
                  onClick={() => handleModuleAction(selectedModule.id, 'feature')}
                >
                  ⭐ 추천하기
                </button>
              )}
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteModule(selectedModule.id)}
              >
                🗑️ 삭제
              </button>
              <button 
                className={styles.cancelButton}
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