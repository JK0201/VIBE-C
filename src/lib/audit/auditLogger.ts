import { promises as fs } from 'fs';
import path from 'path';
import { AuditLog, AuditAction } from '@/types/audit.types';

const AUDIT_LOG_FILE = path.join(process.cwd(), 'data/mock/audit-logs.json');

// Ensure audit log file exists
async function ensureAuditLogFile() {
  try {
    await fs.access(AUDIT_LOG_FILE);
  } catch {
    // File doesn't exist, create it
    await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify({ logs: [] }, null, 2));
  }
}

// Load audit logs
export async function loadAuditLogs(): Promise<AuditLog[]> {
  await ensureAuditLogFile();
  const fileContent = await fs.readFile(AUDIT_LOG_FILE, 'utf-8');
  const data = JSON.parse(fileContent);
  return data.logs || [];
}

// Save audit logs
async function saveAuditLogs(logs: AuditLog[]) {
  await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify({ logs }, null, 2));
}

// Log an admin action
export async function logAdminAction({
  adminId,
  adminEmail,
  action,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent
}: {
  adminId: number;
  adminEmail: string;
  action: AuditAction | string;
  entity: string;
  entityId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  const logs = await loadAuditLogs();
  
  const newLog: AuditLog = {
    id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
    adminId,
    adminEmail,
    action,
    entity,
    entityId,
    details: details || {},
    ipAddress,
    userAgent,
    createdAt: new Date().toISOString()
  };
  
  logs.push(newLog);
  
  // Keep only last 1000 logs in memory
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }
  
  await saveAuditLogs(logs);
  
  return newLog;
}

// Get audit logs with filtering
export async function getAuditLogs({
  adminId,
  action,
  entity,
  dateFrom,
  dateTo,
  search,
  page = 1,
  limit = 20
}: {
  adminId?: number;
  action?: string;
  entity?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let logs = await loadAuditLogs();
  
  // Apply filters
  if (adminId) {
    logs = logs.filter(log => log.adminId === adminId);
  }
  
  if (action) {
    logs = logs.filter(log => log.action === action);
  }
  
  if (entity) {
    logs = logs.filter(log => log.entity === entity);
  }
  
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    logs = logs.filter(log => new Date(log.createdAt) >= fromDate);
  }
  
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    logs = logs.filter(log => new Date(log.createdAt) <= toDate);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    logs = logs.filter(log => 
      log.adminEmail.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.entity.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.details).toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date (newest first)
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Paginate
  const totalLogs = logs.length;
  const totalPages = Math.ceil(totalLogs / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = logs.slice(startIndex, endIndex);
  
  return {
    logs: paginatedLogs,
    pagination: {
      page,
      limit,
      totalLogs,
      totalPages,
      hasMore: page < totalPages
    }
  };
}

