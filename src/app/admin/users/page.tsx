'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
  balance: number;
  githubId?: string;
  profileImage?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    developers: 0,
    users: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        role: roleFilter,
        sortBy: 'id',
        sortOrder: 'desc'
      });

      const res = await fetch(`/api/v1/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      
      // Calculate stats
      const allUsers = data.users;
      setStats({
        total: data.pagination.totalItems || allUsers.length,
        admins: allUsers.filter((u: User) => u.role === 'admin').length,
        developers: allUsers.filter((u: User) => u.role === 'developer').length,
        users: allUsers.filter((u: User) => u.role === 'user').length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('사용자 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error('Failed to update user');
      
      showToast('사용자 정보가 업데이트되었습니다', 'success');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('사용자 업데이트에 실패했습니다', 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      
      showToast('사용자가 삭제되었습니다', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast(error.message || '사용자 삭제에 실패했습니다', 'error');
    }
  };

  const roleOptions: FilterOption[] = [
    { value: '', label: '전체 역할' },
    { value: 'user', label: '일반 사용자' },
    { value: 'developer', label: '개발자' },
    { value: 'admin', label: '관리자' }
  ];

  const columns: TableColumn<User>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { 
      key: 'profileImage', 
      header: '프로필',
      width: '80px',
      render: (_, user) => (
        <div className={styles.avatarWrapper}>
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.nickname}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>
              <span>{user.nickname?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'email', header: '이메일' },
    { 
      key: 'nickname', 
      header: '닉네임',
      render: (_, user) => (
        <div className={styles.userInfo}>
          <span>{user.nickname}</span>
          {user.githubId && (
            <a 
              href={`https://github.com/${user.githubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              @{user.githubId}
            </a>
          )}
        </div>
      )
    },
    { 
      key: 'role', 
      header: '역할',
      render: (role) => {
        switch(role) {
          case 'admin': return StatusBadge.admin();
          case 'developer': return StatusBadge.developer();
          case 'user': return StatusBadge.user();
          default: return <AdminBadge>{role}</AdminBadge>;
        }
      }
    },
    { 
      key: 'balance', 
      header: '잔액',
      render: (balance) => <AdminBadge variant="info">{balance.toLocaleString()}P</AdminBadge>
    },
    { 
      key: 'createdAt', 
      header: '가입일',
      render: (date) => date ? new Date(date).toLocaleDateString('ko-KR') : '-'
    },
    { 
      key: 'actions', 
      header: '액션',
      render: (_, user) => (
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              setEditingUser(user);
              setShowEditModal(true);
            }}
          >
            수정
          </button>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user.id);
            }}
            disabled={user.role === 'admin'}
          >
            삭제
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>사용자 관리</h1>
        <p className="admin-subtitle">
          전체 사용자 목록을 관리하고 권한을 수정할 수 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <AdminStatsCard
          title="전체 사용자"
          value={stats.total}
          icon="👥"
        />
        <AdminStatsCard
          title="관리자"
          value={stats.admins}
          icon="👨‍💼"
        />
        <AdminStatsCard
          title="개발자"
          value={stats.developers}
          icon="👨‍💻"
        />
        <AdminStatsCard
          title="일반 사용자"
          value={stats.users}
          icon="👤"
        />
      </div>

      {/* Search and Filters */}
      <div className="admin-controls">
        <AdminSearchBar
          placeholder="이메일, 닉네임, GitHub ID로 검색..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onRefresh={fetchUsers}
        />
        
        <AdminFilter
          options={roleOptions}
          value={roleFilter}
          onChange={(value) => {
            setRoleFilter(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Users Table */}
      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="등록된 사용자가 없습니다"
      />

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>사용자 정보 수정</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUser(editingUser.id, {
                nickname: formData.get('nickname') as string,
                role: formData.get('role') as string,
                balance: parseInt(formData.get('balance') as string, 10)
              });
            }}>
              <div className={styles.formGroup}>
                <label>닉네임</label>
                <input
                  name="nickname"
                  defaultValue={editingUser.nickname}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>역할</label>
                <select name="role" defaultValue={editingUser.role}>
                  <option value="user">일반 사용자</option>
                  <option value="developer">개발자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>잔액</label>
                <input
                  name="balance"
                  type="number"
                  defaultValue={editingUser.balance}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  저장
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowEditModal(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}