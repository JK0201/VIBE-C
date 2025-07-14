import { NextRequest, NextResponse } from 'next/server';
import testersData from '@data/mock/testers.json';
import usersData from '@data/mock/users.json';
import fs from 'fs/promises';
import path from 'path';

const TESTERS_FILE_PATH = path.join(process.cwd(), 'data', 'mock', 'testers.json');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const params = await context.params;
    const testerId = parseInt(params.id);
    
    const tester = testersData.testers.find(t => t.id === testerId);
    
    if (!tester) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tester not found',
        },
        { status: 404 }
      );
    }

    // Add user information if userId exists
    const user = tester.userId ? usersData.users.find(u => u.id === tester.userId) : null;
    const enrichedTester = {
      ...tester,
      userName: user?.nickname || 'Unknown',
      userEmail: user?.email || ''
    };

    return NextResponse.json({
      success: true,
      ...enrichedTester
    });
  } catch (error) {
    console.error('Admin tester detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tester details',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const testerId = parseInt(params.id);
    const body = await request.json();
    const { action } = body;

    // Read current data
    const fileContent = await fs.readFile(TESTERS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const testerIndex = data.testers.findIndex((t: any) => t.id === testerId);
    
    if (testerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tester not found',
        },
        { status: 404 }
      );
    }

    let message = '';

    switch (action) {
      case 'close':
        data.testers[testerIndex].status = 'CLOSED';
        data.testers[testerIndex].closedAt = new Date().toISOString();
        message = '테스터 모집이 종료되었습니다';
        break;
      
      case 'complete':
        data.testers[testerIndex].status = 'COMPLETED';
        data.testers[testerIndex].completedAt = new Date().toISOString();
        message = '테스터 모집이 완료되었습니다';
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 }
        );
    }

    // Write updated data back to file
    await fs.writeFile(
      TESTERS_FILE_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message,
      tester: data.testers[testerIndex]
    });
  } catch (error) {
    console.error('Admin tester action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update tester',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const testerId = parseInt(params.id);

    // Read current data
    const fileContent = await fs.readFile(TESTERS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const testerIndex = data.testers.findIndex((t: any) => t.id === testerId);
    
    if (testerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tester not found',
        },
        { status: 404 }
      );
    }

    // Remove the tester
    data.testers.splice(testerIndex, 1);

    // Write updated data back to file
    await fs.writeFile(
      TESTERS_FILE_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Tester deleted successfully'
    });
  } catch (error) {
    console.error('Admin tester delete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete tester',
      },
      { status: 500 }
    );
  }
}