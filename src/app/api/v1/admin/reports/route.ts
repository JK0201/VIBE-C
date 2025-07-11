import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { logAdminAction } from '@/lib/audit/auditLogger';
import { AuditAction } from '@/types/audit.types';

// Load data from JSON files
async function loadData(filename: string) {
  const filePath = path.join(process.cwd(), 'data/mock', filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Generate report based on type and date range
async function generateReport(type: string, dateFrom: string, dateTo: string) {
  const fromDate = new Date(dateFrom);
  const toDate = new Date(dateTo);
  toDate.setHours(23, 59, 59, 999);

  switch (type) {
    case 'users': {
      const data = await loadData('users.json');
      const users = data.users.filter((user: any) => {
        const createdAt = new Date(user.createdAt || '2024-01-01');
        return createdAt >= fromDate && createdAt <= toDate;
      });

      return {
        title: '사용자 가입 리포트',
        period: `${dateFrom} ~ ${dateTo}`,
        summary: {
          totalUsers: users.length,
          developers: users.filter((u: any) => u.role === 'developer').length,
          admins: users.filter((u: any) => u.role === 'admin').length,
          regularUsers: users.filter((u: any) => u.role === 'user').length,
          totalBalance: users.reduce((sum: number, u: any) => sum + (u.balance || 0), 0)
        },
        data: users.map((u: any) => ({
          id: u.id,
          email: u.email,
          nickname: u.nickname,
          role: u.role,
          balance: u.balance,
          createdAt: u.createdAt
        }))
      };
    }

    case 'modules': {
      const data = await loadData('components.json');
      const modules = data.components.filter((module: any) => {
        const createdAt = new Date(module.createdAt || '2024-01-01');
        return createdAt >= fromDate && createdAt <= toDate;
      });

      const categoryStats: { [key: string]: number } = {};
      modules.forEach((m: any) => {
        categoryStats[m.category] = (categoryStats[m.category] || 0) + 1;
      });

      return {
        title: '모듈 등록 리포트',
        period: `${dateFrom} ~ ${dateTo}`,
        summary: {
          totalModules: modules.length,
          totalSales: modules.reduce((sum: number, m: any) => sum + (m.purchases || 0), 0),
          totalRevenue: modules.reduce((sum: number, m: any) => 
            sum + ((m.purchases || 0) * (m.price || 0)), 0),
          averageRating: modules.reduce((sum: number, m: any) => 
            sum + (m.rating || 0), 0) / modules.length || 0,
          categoryBreakdown: categoryStats
        },
        data: modules.map((m: any) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          price: m.price,
          purchases: m.purchases,
          rating: m.rating,
          createdAt: m.createdAt
        }))
      };
    }

    case 'transactions': {
      // Generate mock transaction data for the period
      const transactions = [];
      const types = ['MODULE_PURCHASE', 'REQUEST_PAYMENT', 'WITHDRAWAL', 'DEPOSIT'];
      
      // Generate random transactions for the date range
      const daysDiff = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      const numTransactions = Math.min(daysDiff * 5, 100); // Max 100 transactions
      
      for (let i = 0; i < numTransactions; i++) {
        const date = new Date(fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime()));
        const type = types[Math.floor(Math.random() * types.length)];
        const amount = Math.floor(Math.random() * 500000) + 10000;
        
        transactions.push({
          id: i + 1,
          type,
          amount,
          fee: Math.floor(amount * 0.05),
          netAmount: Math.floor(amount * 0.95),
          status: 'COMPLETED',
          createdAt: date.toISOString()
        });
      }

      const typeStats: { [key: string]: number } = {};
      const typeAmounts: { [key: string]: number } = {};
      
      transactions.forEach(t => {
        typeStats[t.type] = (typeStats[t.type] || 0) + 1;
        typeAmounts[t.type] = (typeAmounts[t.type] || 0) + t.amount;
      });

      return {
        title: '거래 내역 리포트',
        period: `${dateFrom} ~ ${dateTo}`,
        summary: {
          totalTransactions: transactions.length,
          totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
          totalFees: transactions.reduce((sum, t) => sum + t.fee, 0),
          transactionsByType: typeStats,
          volumeByType: typeAmounts
        },
        data: transactions
      };
    }

    case 'revenue': {
      // Generate revenue report
      const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      const dailyRevenue = [];
      
      for (let i = 0; i <= days; i++) {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + i);
        
        dailyRevenue.push({
          date: date.toISOString().split('T')[0],
          moduleSales: Math.floor(Math.random() * 10) * 50000,
          requestPayments: Math.floor(Math.random() * 5) * 100000,
          fees: Math.floor(Math.random() * 50000) + 10000,
          refunds: Math.floor(Math.random() * 2) * 30000
        });
      }

      const totalModuleSales = dailyRevenue.reduce((sum, d) => sum + d.moduleSales, 0);
      const totalRequestPayments = dailyRevenue.reduce((sum, d) => sum + d.requestPayments, 0);
      const totalFees = dailyRevenue.reduce((sum, d) => sum + d.fees, 0);
      const totalRefunds = dailyRevenue.reduce((sum, d) => sum + d.refunds, 0);

      return {
        title: '수익 분석 리포트',
        period: `${dateFrom} ~ ${dateTo}`,
        summary: {
          totalRevenue: totalModuleSales + totalRequestPayments,
          totalFees,
          totalRefunds,
          netRevenue: totalFees - totalRefunds,
          dailyAverage: Math.floor(totalFees / (days + 1))
        },
        data: dailyRevenue
      };
    }

    default:
      throw new Error('Invalid report type');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, dateFrom, dateTo } = await request.json();

    if (!type || !dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate report
    const report = await generateReport(type, dateFrom, dateTo);

    // Log the action
    await logAdminAction({
      adminId: parseInt(session.user?.id || '0'),
      adminEmail: session.user?.email || '',
      action: AuditAction.REPORT_GENERATE,
      entity: 'system',
      details: {
        reportType: type,
        dateRange: { from: dateFrom, to: dateTo }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    });

    return NextResponse.json({
      success: true,
      report,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}