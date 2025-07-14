import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { logAdminAction } from '@/lib/audit/auditLogger';
import { AuditAction } from '@/types/audit.types';

async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function saveUsers(data: any) {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id, 10);
    const data = await loadUsers();
    const user = data.users.find((u: any) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password before sending
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id, 10);
    const updates = await request.json();
    
    const data = await loadUsers();
    const userIndex = data.users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user data (except password)
    const { password, ...safeUpdates } = updates;
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...safeUpdates,
      updatedAt: new Date().toISOString()
    };

    await saveUsers(data);

    // Log the action
    const oldUser = { ...data.users[userIndex], ...updates };
    await logAdminAction({
      adminId: parseInt(session.user?.id || '0'),
      adminEmail: session.user?.email || '',
      action: oldUser.role !== safeUpdates.role ? AuditAction.USER_ROLE_CHANGE : 
              oldUser.balance !== safeUpdates.balance ? AuditAction.USER_BALANCE_CHANGE :
              AuditAction.USER_UPDATE,
      entity: 'user',
      entityId: userId,
      details: {
        changes: safeUpdates,
        oldValues: {
          role: oldUser.role,
          balance: oldUser.balance,
          nickname: oldUser.nickname
        }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    });

    // Return updated user without password
    const { password: _, ...updatedUser } = data.users[userIndex];
    
    return NextResponse.json({
      user: updatedUser,
      message: '사용자 정보가 업데이트되었습니다'
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id, 10);
    
    // Prevent deleting admin users
    const data = await loadUsers();
    const user = data.users.find((u: any) => u.id === userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: '관리자 계정은 삭제할 수 없습니다' },
        { status: 403 }
      );
    }

    // Remove user
    data.users = data.users.filter((u: any) => u.id !== userId);
    await saveUsers(data);

    // Log the action
    await logAdminAction({
      adminId: parseInt(session.user?.id || '0'),
      adminEmail: session.user?.email || '',
      action: AuditAction.USER_DELETE,
      entity: 'user',
      entityId: userId,
      details: {
        deletedUser: {
          email: user.email,
          nickname: user.nickname,
          role: user.role
        }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || ''
    });

    return NextResponse.json({
      message: '사용자가 삭제되었습니다'
    });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}