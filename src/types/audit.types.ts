export interface AuditLog {
  id: number;
  adminId: number;
  adminEmail: string;
  action: string;
  entity: string;
  entityId?: number;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export enum AuditAction {
  // User actions
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ROLE_CHANGE = 'USER_ROLE_CHANGE',
  USER_BALANCE_CHANGE = 'USER_BALANCE_CHANGE',
  
  // Module actions
  MODULE_APPROVE = 'MODULE_APPROVE',
  MODULE_REJECT = 'MODULE_REJECT',
  MODULE_DELETE = 'MODULE_DELETE',
  MODULE_FEATURE = 'MODULE_FEATURE',
  MODULE_UNFEATURE = 'MODULE_UNFEATURE',
  
  // Request actions
  REQUEST_CLOSE = 'REQUEST_CLOSE',
  REQUEST_CANCEL = 'REQUEST_CANCEL',
  REQUEST_DELETE = 'REQUEST_DELETE',
  REQUEST_EXTEND = 'REQUEST_EXTEND',
  
  // Transaction actions
  TRANSACTION_REFUND = 'TRANSACTION_REFUND',
  
  // System actions
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
  REPORT_GENERATE = 'REPORT_GENERATE',
  SYSTEM_BACKUP = 'SYSTEM_BACKUP',
}

export interface AuditLogFilter {
  adminId?: number;
  action?: string;
  entity?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}