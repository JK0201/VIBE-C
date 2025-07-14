import { NextRequest, NextResponse } from 'next/server';
import componentsData from '@data/mock/components.json';
import usersData from '@data/mock/users.json';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const params = await context.params;
    const moduleId = parseInt(params.id);
    
    // Find the module by ID
    const foundModule = componentsData.components.find(c => c.id === moduleId);
    
    if (!foundModule) {
      return NextResponse.json(
        {
          success: false,
          error: 'Module not found',
        },
        { status: 404 }
      );
    }

    // Only approved modules can be accessed by users
    if (foundModule.status !== 'approved') {
      return NextResponse.json(
        {
          success: false,
          error: 'Module not found',
        },
        { status: 404 }
      );
    }

    // Find the author/seller information
    const author = usersData.users.find(u => u.id === foundModule.sellerId);
    
    // Build the detailed response
    const detailedModule = {
      id: foundModule.id,
      name: foundModule.name,
      description: foundModule.description,
      detailDescription: foundModule.description,
      category: foundModule.category,
      price: foundModule.price,
      rating: foundModule.rating,
      purchases: foundModule.purchases,
      tags: foundModule.tags,
      sellerId: foundModule.sellerId,  // Add sellerId to the response
      features: foundModule.features || [
        '완전한 소스 코드 제공',
        '상세한 설치 가이드',
        '6개월 무료 업데이트',
        '기술 지원 포함'
      ],
      requirements: [
        'Node.js 14.0 이상',
        'npm 또는 yarn',
        '기본적인 JavaScript 지식'
      ],
      lastUpdated: foundModule.updatedAt,
      version: '1.0.0',
      license: foundModule.license || 'MIT',
      githubUrl: foundModule.githubUrl,
      demoUrl: foundModule.demoUrl,
      images: foundModule.images || [],
      author: author ? {
        id: author.id,
        name: author.nickname,
        email: author.email,
        profileImage: author.profileImage,
        githubId: author.githubId,
        rating: 4.5,
        transactionCount: 12,
        isVerified: true,
        joinDate: author.createdAt,
        bio: author.bio || '열정적인 개발자입니다.',
        totalSales: 0,
      } : null,
      // Add display properties for UI
      gradient: getGradientByCategory(foundModule.category),
      icon: getIconByCategory(foundModule.category),
      categoryDisplay: getCategoryDisplay(foundModule.category),
    };

    return NextResponse.json({
      success: true,
      data: detailedModule,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch module details',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getGradientByCategory(category: string): string {
  const gradients: Record<string, string> = {
    // New category system
    'sns': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'automation': 'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)',
    'web-app': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'mobile': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    'ui-ux': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'data': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    'ai-ml': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    'fintech': 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    'b2b': 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    // Old category system (for backward compatibility)
    'website': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'ecommerce': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'ai': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    'backend': 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    'blockchain': 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    'devops': 'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)',
  };
  return gradients[category] || 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';
}

function getIconByCategory(category: string): string {
  const icons: Record<string, string> = {
    // New category system
    'sns': '💬',
    'automation': '🔧',
    'web-app': '🌐',
    'mobile': '📱',
    'ui-ux': '🎨',
    'data': '📊',
    'ai-ml': '🤖',
    'fintech': '💰',
    'b2b': '🏢',
    // Old category system (for backward compatibility)
    'website': '🌐',
    'ecommerce': '🛍️',
    'ai': '🤖',
    'backend': '⚙️',
    'blockchain': '🔗',
    'devops': '🚀',
  };
  return icons[category] || '📦';
}

function getCategoryDisplay(category: string): { name: string; color: string } {
  const categories: Record<string, { name: string; color: string }> = {
    // New category system
    'sns': { name: 'SNS', color: '#667EEA' },
    'automation': { name: 'Automation', color: '#FEB692' },
    'web-app': { name: 'Web/App', color: '#667EEA' },
    'mobile': { name: 'Mobile', color: '#F093FB' },
    'ui-ux': { name: 'UI/UX', color: '#4FACFE' },
    'data': { name: 'Data', color: '#8B5CF6' },
    'ai-ml': { name: 'AI/ML', color: '#FA709A' },
    'fintech': { name: 'Fintech', color: '#A8EDEA' },
    'b2b': { name: 'B2B', color: '#30CFD0' },
    // Old category system (for backward compatibility)
    'website': { name: 'Web/App', color: '#667EEA' },
    'ecommerce': { name: 'Web/App', color: '#4FACFE' },
    'ai': { name: 'AI/ML', color: '#FA709A' },
    'backend': { name: 'B2B', color: '#30CFD0' },
    'blockchain': { name: 'Fintech', color: '#A8EDEA' },
    'devops': { name: 'Automation', color: '#FEB692' },
  };
  
  // Convert to uppercase and replace hyphens with slashes for display
  const defaultName = category.toUpperCase().replace(/-/g, '/');
  
  return categories[category] || { name: defaultName, color: '#667EEA' };
}