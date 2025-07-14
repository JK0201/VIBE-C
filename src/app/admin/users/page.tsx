'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';

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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  const roleOptions = [
    { value: '', label: '전체 역할' },
    { value: 'user', label: '일반 사용자' },
    { value: 'developer', label: '개발자' },
    { value: 'admin', label: '관리자' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>사용자 관리</h1>
        <p className={styles.subtitle}>
          전체 사용자 목록을 관리하고 권한을 수정할 수 있습니다
        </p>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="이메일, 닉네임, GitHub ID로 검색..."
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
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {roleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button 
          className={styles.refreshButton}
          onClick={fetchUsers}
          title="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>사용자 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>프로필</th>
                  <th>이메일</th>
                  <th>닉네임</th>
                  <th>역할</th>
                  <th>잔액</th>
                  <th>가입일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
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
                    </td>
                    <td>{user.email}</td>
                    <td>
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
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.balance.toLocaleString()}P</td>
                    <td>
                      {new Date(user.createdAt || '').toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          삭제
                        </button>
                      </div>
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