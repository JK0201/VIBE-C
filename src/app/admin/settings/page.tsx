'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import useUIStore from '@/stores/useUIStore';
import { AuditAction } from '@/types/audit.types';

interface Settings {
  platformFee: number;
  urgentFee: number;
  bidDepositRate: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  moduleSubmissionEnabled: boolean;
  emailNotifications: boolean;
}

export default function AdminSettingsPage() {
  const { showToast } = useUIStore();
  
  const [settings, setSettings] = useState<Settings>({
    platformFee: 5,
    urgentFee: 2,
    bidDepositRate: 1,
    minWithdrawal: 10000,
    maxWithdrawal: 1000000,
    maintenanceMode: false,
    registrationEnabled: true,
    moduleSubmissionEnabled: true,
    emailNotifications: true
  });
  
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    // Load settings from config
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real app, this would fetch from API
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Save to localStorage (in real app, would save to database)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // Log the action via API
      await fetch('/api/v1/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: AuditAction.SETTINGS_UPDATE,
          entity: 'system',
          details: { settings }
        })
      });
      
      showToast('설정이 저장되었습니다', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('설정 저장에 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const testEmailNotification = async () => {
    if (!testEmail) {
      showToast('테스트 이메일 주소를 입력해주세요', 'error');
      return;
    }

    try {
      // In real app, would send test email
      showToast(`${testEmail}로 테스트 이메일을 전송했습니다`, 'success');
      setTestEmail('');
    } catch (error) {
      showToast('테스트 이메일 전송에 실패했습니다', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>시스템 설정</h1>
        <p className={styles.subtitle}>
          플랫폼의 주요 설정을 관리합니다
        </p>
      </div>

      {/* Fee Settings */}
      <div className={styles.settingsSection}>
        <h2>수수료 설정</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <label>플랫폼 수수료 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.platformFee}
              onChange={(e) => handleSettingChange('platformFee', parseFloat(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>모든 거래에 적용되는 기본 수수료입니다</p>
          </div>

          <div className={styles.settingItem}>
            <label>긴급 요청 추가 수수료 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.urgentFee}
              onChange={(e) => handleSettingChange('urgentFee', parseFloat(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>긴급 요청에 부과되는 추가 수수료입니다</p>
          </div>

          <div className={styles.settingItem}>
            <label>입찰 보증금 비율 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.bidDepositRate}
              onChange={(e) => handleSettingChange('bidDepositRate', parseFloat(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>경매 입찰 시 필요한 보증금 비율입니다</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Settings */}
      <div className={styles.settingsSection}>
        <h2>출금 설정</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <label>최소 출금 금액 (P)</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={settings.minWithdrawal}
              onChange={(e) => handleSettingChange('minWithdrawal', parseInt(e.target.value))}
              className={styles.input}
            />
          </div>

          <div className={styles.settingItem}>
            <label>최대 출금 금액 (P)</label>
            <input
              type="number"
              min="0"
              step="10000"
              value={settings.maxWithdrawal}
              onChange={(e) => handleSettingChange('maxWithdrawal', parseInt(e.target.value))}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className={styles.settingsSection}>
        <h2>시스템 설정</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className={styles.checkbox}
              />
              <span>유지보수 모드</span>
            </label>
            <p className={styles.hint}>활성화 시 관리자만 접속 가능합니다</p>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.registrationEnabled}
                onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                className={styles.checkbox}
              />
              <span>신규 가입 허용</span>
            </label>
            <p className={styles.hint}>비활성화 시 새로운 사용자 가입이 차단됩니다</p>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.moduleSubmissionEnabled}
                onChange={(e) => handleSettingChange('moduleSubmissionEnabled', e.target.checked)}
                className={styles.checkbox}
              />
              <span>모듈 등록 허용</span>
            </label>
            <p className={styles.hint}>비활성화 시 새로운 모듈 등록이 차단됩니다</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={styles.settingsSection}>
        <h2>알림 설정</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className={styles.checkbox}
              />
              <span>이메일 알림 활성화</span>
            </label>
            <p className={styles.hint}>중요한 이벤트 발생 시 이메일 알림을 전송합니다</p>
          </div>

          <div className={styles.settingItem}>
            <label>테스트 이메일 전송</label>
            <div className={styles.testEmailContainer}>
              <input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className={styles.input}
              />
              <button onClick={testEmailNotification} className={styles.testButton}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? '저장 중...' : '설정 저장'}
        </button>
        <button
          className={styles.resetButton}
          onClick={loadSettings}
        >
          초기화
        </button>
      </div>

      {/* Current Settings Display */}
      <div className={styles.currentSettings}>
        <h3>현재 설정 값</h3>
        <pre className={styles.settingsJson}>
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}