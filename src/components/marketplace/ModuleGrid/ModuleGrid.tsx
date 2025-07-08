import { useState } from 'react';
import Link from 'next/link';
import styles from './ModuleGrid.module.css';
import carouselStyles from '@/components/common/ModuleCarousel/ModuleCarousel.module.css';
import { formatRelativeTime } from '@/lib/formatDate';

interface Component {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  language: string;
  framework: string;
  license: string;
  githubUrl: string;
  demoUrl?: string;
  sellerId: number;
  features: string[];
  purchases: number;
  rating: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

interface ModuleGridProps {
  components: Component[];
}

// Category mapping for display
const categoryMap: Record<string, { name: string; icon: string; gradient: string }> = {
  // New category system
  'sns': { name: 'SNS', icon: '💬', gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
  'automation': { name: 'Automation', icon: '🔧', gradient: 'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)' },
  'web-app': { name: 'Web/App', icon: '🌐', gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
  'mobile': { name: 'Mobile', icon: '📱', gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' },
  'ui-ux': { name: 'UI/UX', icon: '🎨', gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' },
  'data': { name: 'Data', icon: '📊', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)' },
  'ai-ml': { name: 'AI/ML', icon: '🤖', gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)' },
  'fintech': { name: 'Fintech', icon: '💰', gradient: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)' },
  'b2b': { name: 'B2B', icon: '🏢', gradient: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)' },
  // Old category system (for backward compatibility)
  'website': { name: 'Web/App', icon: '🌐', gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
  'ecommerce': { name: 'Web/App', icon: '🛒', gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' },
  'ai': { name: 'AI/ML', icon: '🤖', gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)' },
  'backend': { name: 'B2B', icon: '⚙️', gradient: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)' },
  'blockchain': { name: 'Fintech', icon: '⛓️', gradient: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)' },
  'devops': { name: 'Automation', icon: '🚀', gradient: 'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)' },
};

export default function ModuleGrid({ components }: ModuleGridProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };



  return (
    <div className={styles.moduleGrid}>
      {components.map((component) => {
        const categoryInfo = categoryMap[component.category] || { 
          name: component.category, 
          icon: '📦', 
          gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' 
        };

        return (
          <Link
            key={component.id}
            href={`/marketplace/${component.id}`}
            className={styles.moduleCard}
          >
            <button
              className={`${styles.favoriteBtn} ${favorites.has(component.id) ? styles.active : ''}`}
              onClick={(e) => toggleFavorite(component.id, e)}
              aria-label={favorites.has(component.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.has(component.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <div className={`${carouselStyles.componentCard} ${styles.componentCard}`}>
              <div className={carouselStyles.componentImage}>
                <div className={carouselStyles.imagePlaceholder} style={{background: categoryInfo.gradient}}>
                  <span className={carouselStyles.imageIcon}>{categoryInfo.icon}</span>
                </div>
                <div className={carouselStyles.componentCategory}>{categoryInfo.name}</div>
              </div>
              
              <div className={carouselStyles.componentContent}>
                <h3 className={carouselStyles.componentTitle}>{component.name}</h3>
                <div className={styles.createdDate}>
                  {formatRelativeTime(component.createdAt)} · 💬 {component.comments}
                </div>
                <p className={carouselStyles.componentDesc}>{component.description}</p>
                
                <div className={carouselStyles.componentTags}>
                  {component.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className={carouselStyles.tag}>{tag}</span>
                  ))}
                  {component.tags.length > 2 && (
                    <span className={carouselStyles.moreTag}>+{component.tags.length - 2}</span>
                  )}
                </div>
                
                <div className={carouselStyles.componentFooter}>
                  <div className={carouselStyles.componentPrice}>
                    <span className={carouselStyles.priceAmount}>{component.price.toLocaleString()}</span>
                    <span className={carouselStyles.priceUnit}>P</span>
                  </div>
                  <div className={carouselStyles.componentStats}>
                    <span className={carouselStyles.stat}>
                      <span className={carouselStyles.statIcon}>⭐</span>
                      {component.rating}
                    </span>
                    <span className={carouselStyles.stat}>
                      <span className={carouselStyles.statIcon}>💾</span>
                      {component.purchases}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}