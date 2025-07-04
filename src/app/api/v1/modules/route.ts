import { NextRequest, NextResponse } from 'next/server';
import componentsData from '@data/mock/components.json';
import usersData from '@data/mock/users.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'latest';
    const priceRange = searchParams.getAll('priceRange');
    const language = searchParams.getAll('language');
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Filter modules
    let filteredModules = componentsData.components.filter(component => {
      // Category filter
      if (category !== 'all' && component.category !== category) {
        return false;
      }

      // Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch = 
          component.name.toLowerCase().includes(query) ||
          component.description.toLowerCase().includes(query) ||
          component.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Price filter
      if (priceRange.length > 0) {
        const matchesPrice = priceRange.some(range => {
          const [min, max] = range.split('-').map(Number);
          return component.price >= min && component.price <= max;
        });
        if (!matchesPrice) return false;
      }

      // Language filter
      if (language.length > 0) {
        const matchesLanguage = language.some(lang => 
          component.tags.some(tag => tag.toLowerCase() === lang.toLowerCase())
        );
        if (!matchesLanguage) return false;
      }

      // Rating filter
      if (rating !== null) {
        const ratingNum = parseFloat(rating);
        if (ratingNum === 4) {
          // 4점 이상: 4.0 ~ 5.0
          if (component.rating < 4) return false;
        } else {
          // 1,2,3점대: n.0 ~ n.9
          if (component.rating < ratingNum || component.rating >= ratingNum + 1) return false;
        }
      }

      return true;
    });

    // Sort modules
    filteredModules = [...filteredModules].sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.purchases - a.purchases;
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    // Calculate pagination
    const total = filteredModules.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedModules = filteredModules.slice(startIndex, endIndex);

    // Enhance modules with author information
    const enhancedModules = paginatedModules.map(module => {
      const author = usersData.users.find(u => u.id === module.sellerId);
      
      return {
        ...module,
        author: author ? {
          id: author.id,
          name: author.name,
          profileImage: author.profileImage,
          githubId: author.githubId,
        } : null,
        // Add display properties
        categoryDisplay: getCategoryDisplay(module.category),
      };
    });

    return NextResponse.json({
      success: true,
      data: enhancedModules,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch modules',
      },
      { status: 500 }
    );
  }
}

// Helper function
function getCategoryDisplay(category: string): { name: string; gradient: string; icon: string } {
  const categories: Record<string, { name: string; gradient: string; icon: string }> = {
    'website': { 
      name: '웹사이트', 
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '🌐'
    },
    'mobile': { 
      name: '모바일 앱', 
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      icon: '📱'
    },
    'ecommerce': { 
      name: '이커머스', 
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      icon: '🛒'
    },
    'ai': { 
      name: 'AI/ML', 
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      icon: '🤖'
    },
    'backend': { 
      name: '백엔드/API', 
      gradient: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
      icon: '⚙️'
    },
    'blockchain': { 
      name: '블록체인', 
      gradient: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
      icon: '🔗'
    },
    'data': { 
      name: '데이터 분석', 
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      icon: '📊'
    },
    'devops': { 
      name: 'DevOps', 
      gradient: 'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)',
      icon: '🚀'
    },
  };
  return categories[category] || { 
    name: category, 
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    icon: '📦'
  };
}