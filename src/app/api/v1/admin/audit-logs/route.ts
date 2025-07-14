import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAuditLogs, logAdminAction } from '@/lib/audit/auditLogger';

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
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const adminId = searchParams.get('adminId') ? parseInt(searchParams.get('adminId')!, 10) : undefined;
    const action = searchParams.get('action') || undefined;
    const entity = searchParams.get('entity') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Get audit logs
    const result = await getAuditLogs({
      adminId,
      action,
      entity,
      dateFrom,
      dateTo,
      search,
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, entity, entityId, details } = await request.json();

    // Log the admin action
    const log = await logAdminAction({
      adminId: parseInt((session as any).user?.id || '0'),
      adminEmail: (session as any).user?.email || '',
      action,
      entity,
      entityId,
      details,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    return NextResponse.json(
      { error: 'Failed to log admin action' },
      { status: 500 }
    );
  }
}