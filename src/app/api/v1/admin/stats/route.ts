import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';

// Helper to load JSON data
async function loadJsonData(filename: string) {
  const filePath = path.join(process.cwd(), 'data/mock', filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication - middleware should have already verified admin role
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Load all necessary data
    const [users, modules, requests] = await Promise.all([
      loadJsonData('users.json'),
      loadJsonData('components.json'),
      loadJsonData('requests.json')
    ]);

    // Calculate statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const newUsersThisMonth = users.users.filter((user: any) => {
      const createdAt = new Date(user.createdAt || '2024-01-01');
      return createdAt >= startOfMonth;
    }).length;

    // Module stats
    const totalModuleSales = modules.components.reduce((sum: number, module: any) => {
      return sum + (module.purchases || 0);
    }, 0);

    const pendingModules = modules.components.filter((module: any) => 
      module.status === 'pending'
    ).length;

    // Request stats
    const openRequests = requests.requests.filter((req: any) => 
      req.status === 'OPEN'
    ).length;

    const urgentRequests = requests.requests.filter((req: any) => 
      req.isUrgent === true
    ).length;

    // Revenue calculations (simulated)
    const totalRevenue = modules.components.reduce((sum: number, module: any) => {
      const sales = module.purchases || 0;
      const price = module.price || 0;
      const platformFee = 0.05; // 5% platform fee
      return sum + (sales * price * platformFee);
    }, 0);

    const monthlyRevenue = Math.floor(totalRevenue * 0.15); // Simulated monthly revenue

    const stats = {
      users: {
        total: users.users.length,
        newThisMonth: newUsersThisMonth,
        activeToday: Math.floor(users.users.length * 0.3) // Simulated active users
      },
      modules: {
        total: modules.components.length,
        pendingApproval: pendingModules,
        totalSales: totalModuleSales
      },
      requests: {
        total: requests.requests.length,
        open: openRequests,
        urgent: urgentRequests
      },
      revenue: {
        totalRevenue: Math.floor(totalRevenue),
        monthlyRevenue: monthlyRevenue,
        pendingPayouts: Math.floor(monthlyRevenue * 0.7)
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}