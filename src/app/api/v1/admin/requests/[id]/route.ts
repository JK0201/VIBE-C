import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

async function loadRequests() {
  const filePath = path.join(process.cwd(), 'data/mock/requests.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function saveRequests(data: any) {
  const filePath = path.join(process.cwd(), 'data/mock/requests.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    const [requestsData, usersData] = await Promise.all([
      loadRequests(),
      loadUsers()
    ]);
    
    const requestItem = requestsData.requests.find((r: any) => r.id === requestId);

    if (!requestItem) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Enhance with user info
    const user = usersData.users.find((u: any) => u.id === requestItem.userId);
    
    // For admin view, include all bid amounts (even for blind auctions)
    const enhancedBids = requestItem.bids?.map((bid: any) => {
      const bidder = usersData.users.find((u: any) => u.id === bid.developerId);
      return {
        ...bid,
        developerName: bidder?.nickname || 'Unknown',
        developerEmail: bidder?.email || ''
      };
    }) || [];

    const enhancedRequest = {
      ...requestItem,
      userName: user?.nickname || 'Unknown User',
      userEmail: user?.email || '',
      bids: enhancedBids
    };

    return NextResponse.json(enhancedRequest);
  } catch (error) {
    console.error('Failed to fetch request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    const updates = await request.json();
    
    const data = await loadRequests();
    const requestIndex = data.requests.findIndex((r: any) => r.id === requestId);

    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update request data
    data.requests[requestIndex] = {
      ...data.requests[requestIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await saveRequests(data);
    
    return NextResponse.json({
      request: data.requests[requestIndex],
      message: '요청이 업데이트되었습니다'
    });
  } catch (error) {
    console.error('Failed to update request:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    
    const data = await loadRequests();
    const requestItem = data.requests.find((r: any) => r.id === requestId);
    
    if (!requestItem) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Remove request
    data.requests = data.requests.filter((r: any) => r.id !== requestId);
    await saveRequests(data);

    return NextResponse.json({
      message: '요청이 삭제되었습니다'
    });
  } catch (error) {
    console.error('Failed to delete request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}

// Admin actions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    const { action, data: actionData } = await request.json();
    
    const requestsData = await loadRequests();
    const requestIndex = requestsData.requests.findIndex((r: any) => r.id === requestId);

    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Handle different actions
    switch (action) {
      case 'close':
        requestsData.requests[requestIndex].status = 'CLOSED';
        requestsData.requests[requestIndex].closedAt = new Date().toISOString();
        break;
      case 'cancel':
        requestsData.requests[requestIndex].status = 'CANCELLED';
        requestsData.requests[requestIndex].cancelledAt = new Date().toISOString();
        break;
      case 'extend':
        requestsData.requests[requestIndex].deadline = actionData.newDeadline;
        break;
      case 'selectWinner':
        requestsData.requests[requestIndex].selectedBidId = actionData.bidId;
        requestsData.requests[requestIndex].status = 'IN_PROGRESS';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await saveRequests(requestsData);
    
    return NextResponse.json({
      request: requestsData.requests[requestIndex],
      message: `요청이 ${action === 'close' ? '종료' : action === 'cancel' ? '취소' : action === 'extend' ? '연장' : '처리'}되었습니다`
    });
  } catch (error) {
    console.error('Failed to perform request action:', error);
    return NextResponse.json(
      { error: 'Failed to perform request action' },
      { status: 500 }
    );
  }
}