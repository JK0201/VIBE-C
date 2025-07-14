import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';

async function loadModules() {
  const filePath = path.join(process.cwd(), 'data/mock/components.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function saveModules(data: any) {
  const filePath = path.join(process.cwd(), 'data/mock/components.json');
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
    const moduleId = parseInt(id, 10);
    const data = await loadModules();
    const module = data.components.find((m: any) => m.id === moduleId);

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Add additional admin info
    const adminModule = {
      ...module,
      status: module.status || 'approved',
      reports: module.reports || 0,
      lastReviewed: module.lastReviewed || new Date().toISOString(),
      reviewedBy: module.reviewedBy || 'admin'
    };

    return NextResponse.json(adminModule);
  } catch (error) {
    console.error('Failed to fetch module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
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
    const moduleId = parseInt(id, 10);
    const updates = await request.json();
    
    const data = await loadModules();
    const moduleIndex = data.components.findIndex((m: any) => m.id === moduleId);

    if (moduleIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Update module data
    data.components[moduleIndex] = {
      ...data.components[moduleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await saveModules(data);
    
    return NextResponse.json({
      module: data.components[moduleIndex],
      message: '모듈 정보가 업데이트되었습니다'
    });
  } catch (error) {
    console.error('Failed to update module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
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
    const moduleId = parseInt(id, 10);
    
    const data = await loadModules();
    const module = data.components.find((m: any) => m.id === moduleId);
    
    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Remove module
    data.components = data.components.filter((m: any) => m.id !== moduleId);
    await saveModules(data);

    return NextResponse.json({
      message: '모듈이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Failed to delete module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}

// Approve module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const moduleId = parseInt(id, 10);
    const { action } = await request.json();
    
    const data = await loadModules();
    const moduleIndex = data.components.findIndex((m: any) => m.id === moduleId);

    if (moduleIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Handle different actions
    switch (action) {
      case 'approve':
        data.components[moduleIndex].status = 'approved';
        data.components[moduleIndex].approvedAt = new Date().toISOString();
        break;
      case 'reject':
        data.components[moduleIndex].status = 'rejected';
        data.components[moduleIndex].rejectedAt = new Date().toISOString();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await saveModules(data);
    
    return NextResponse.json({
      module: data.components[moduleIndex],
      message: `모듈이 ${action === 'approve' ? '승인' : '거부'}되었습니다`
    });
  } catch (error) {
    console.error('Failed to update module status:', error);
    return NextResponse.json(
      { error: 'Failed to update module status' },
      { status: 500 }
    );
  }
}