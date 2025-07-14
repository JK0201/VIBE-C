import { NextRequest, NextResponse } from 'next/server';
import componentsData from '@data/mock/components.json';
import usersData from '@data/mock/users.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Validate category parameter
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category parameter is required',
        },
        { status: 400 }
      );
    }

    // Filter components by category
    const categoryModules = componentsData.components
      .filter(component => component.status === 'approved' && component.category === category)
      .sort((a, b) => b.purchases - a.purchases) // Sort by popularity within category
      .slice(0, limit)
      .map(component => {
        const author = usersData.users.find(u => u.id === component.sellerId);
        return {
          id: component.id,
          name: component.name,
          description: component.description,
          category: component.category,
          price: component.price,
          rating: component.rating,
          purchases: component.purchases,
          tags: component.tags,
          githubUrl: component.githubUrl,
          createdAt: component.createdAt,
          author: author ? {
            id: author.id,
            name: author.nickname,
            profileImage: author.profileImage,
          } : null,
          // Add display properties for UI
          gradient: getGradientByCategory(component.category),
          icon: getIconByCategory(component.category),
        };
      });

    return NextResponse.json({
      success: true,
      data: categoryModules,
      meta: {
        category: category,
        total: categoryModules.length,
        limit: limit,
      }
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch modules by category',
      },
      { status: 500 }
    );
  }
}

// Helper functions to map categories to UI properties
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