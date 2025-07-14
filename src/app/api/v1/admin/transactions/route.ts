import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock transaction data generator
function generateTransactions() {
  const types = ['MODULE_PURCHASE', 'REQUEST_PAYMENT', 'WITHDRAWAL', 'DEPOSIT', 'REFUND'];
  const statuses = ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];
  
  const transactions = [];
  const now = new Date();
  
  // Generate 50 mock transactions
  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 500000) + 10000;
    const fee = Math.floor(amount * 0.05); // 5% platform fee
    
    transactions.push({
      id: i,
      type,
      status,
      amount,
      fee,
      netAmount: amount - fee,
      fromUserId: Math.floor(Math.random() * 30) + 1,
      toUserId: Math.floor(Math.random() * 30) + 1,
      moduleId: type === 'MODULE_PURCHASE' ? Math.floor(Math.random() * 20) + 1 : null,
      requestId: type === 'REQUEST_PAYMENT' ? Math.floor(Math.random() * 20) + 1 : null,
      description: getTransactionDescription(type),
      createdAt: new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: status === 'COMPLETED' ? new Date(now.getTime() - Math.random() * 89 * 24 * 60 * 60 * 1000).toISOString() : null
    });
  }
  
  return transactions;
}

function getTransactionDescription(type: string): string {
  switch (type) {
    case 'MODULE_PURCHASE':
      return '모듈 구매';
    case 'REQUEST_PAYMENT':
      return '개발 요청 결제';
    case 'WITHDRAWAL':
      return '수익금 출금';
    case 'DEPOSIT':
      return '포인트 충전';
    case 'REFUND':
      return '환불 처리';
    default:
      return '기타 거래';
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Generate mock transactions
    let transactions = generateTransactions();

    // Apply filters
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      transactions = transactions.filter(t => new Date(t.createdAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      transactions = transactions.filter(t => new Date(t.createdAt) <= toDate);
    }

    // Sort transactions
    transactions.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (sortBy === 'createdAt' || sortBy === 'completedAt') {
        aValue = new Date(aValue as string || '2024-01-01').getTime();
        bValue = new Date(bValue as string || '2024-01-01').getTime();
      }
      
      if (sortOrder === 'asc') {
        return (aValue ?? 0) > (bValue ?? 0) ? 1 : -1;
      } else {
        return (aValue ?? 0) < (bValue ?? 0) ? 1 : -1;
      }
    });

    // Calculate statistics
    const stats = {
      totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalFees: transactions.reduce((sum, t) => sum + t.fee, 0),
      completedCount: transactions.filter(t => t.status === 'COMPLETED').length,
      pendingCount: transactions.filter(t => t.status === 'PENDING').length,
      failedCount: transactions.filter(t => t.status === 'FAILED').length
    };

    // Calculate pagination
    const totalTransactions = transactions.length;
    const totalPages = Math.ceil(totalTransactions / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated transactions
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return NextResponse.json({
      transactions: paginatedTransactions,
      stats,
      pagination: {
        page,
        limit,
        totalTransactions,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// Process refund
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, reason } = await request.json();

    // In a real app, this would process the refund
    // For now, we'll just return a success message
    
    return NextResponse.json({
      success: true,
      message: '환불이 성공적으로 처리되었습니다',
      refundTransaction: {
        id: Math.floor(Math.random() * 1000) + 100,
        originalTransactionId: transactionId,
        type: 'REFUND',
        status: 'COMPLETED',
        reason,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to process refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}