import { AuditAction } from '@/types/audit.types';

// Get action description - Client-side safe
export function getActionDescription(action: string): string {
  const descriptions: { [key: string]: string } = {
    [AuditAction.USER_UPDATE]: '사용자 정보 수정',
    [AuditAction.USER_DELETE]: '사용자 삭제',
    [AuditAction.USER_ROLE_CHANGE]: '사용자 역할 변경',
    [AuditAction.USER_BALANCE_CHANGE]: '사용자 잔액 변경',
    [AuditAction.MODULE_APPROVE]: '모듈 승인',
    [AuditAction.MODULE_REJECT]: '모듈 거부',
    [AuditAction.MODULE_DELETE]: '모듈 삭제',
    [AuditAction.MODULE_FEATURE]: '모듈 추천',
    [AuditAction.MODULE_UNFEATURE]: '모듈 추천 해제',
    [AuditAction.REQUEST_CLOSE]: '요청 종료',
    [AuditAction.REQUEST_CANCEL]: '요청 취소',
    [AuditAction.REQUEST_DELETE]: '요청 삭제',
    [AuditAction.REQUEST_EXTEND]: '요청 기한 연장',
    [AuditAction.TRANSACTION_REFUND]: '거래 환불',
    [AuditAction.SETTINGS_UPDATE]: '설정 변경',
    [AuditAction.REPORT_GENERATE]: '리포트 생성',
    [AuditAction.SYSTEM_BACKUP]: '시스템 백업',
  };
  
  return descriptions[action] || action;
}