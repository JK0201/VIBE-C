import { useEffect, useRef } from 'react';
import styles from './CategoryFilter.module.css';

const marketplaceCategories = [
  { id: 'all', name: '전체', icon: '✨' },
  { id: 'website', name: '웹사이트', icon: '🌐' },
  { id: 'mobile', name: '모바일 앱', icon: '📱' },
  { id: 'ecommerce', name: '이커머스', icon: '🛒' },
  { id: 'ai', name: 'AI/ML', icon: '🤖' },
  { id: 'backend', name: '백엔드/API', icon: '⚙️' },
  { id: 'blockchain', name: '블록체인', icon: '⛓️' },
  { id: 'data', name: '데이터 분석', icon: '📊' },
  { id: 'devops', name: 'DevOps', icon: '🔧' },
];

const testerCategories = [
  { id: 'all', name: '전체', icon: '✨' },
  { id: 'functional', name: '기능', icon: '⚙️' },
  { id: 'ui', name: 'UI/UX', icon: '🎨' },
  { id: 'performance', name: '성능', icon: '⚡' },
  { id: 'security', name: '보안', icon: '🔒' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  type?: 'marketplace' | 'testers';
}

export default function CategoryFilter({ selectedCategory, onCategoryChange, type = 'marketplace' }: CategoryFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const isSticky = useRef(false);
  
  const categories = type === 'testers' ? testerCategories : marketplaceCategories;

  useEffect(() => {
    const handleScroll = () => {
      if (!filterRef.current) return;
      
      const rect = filterRef.current.getBoundingClientRect();
      const shouldBeSticky = rect.top <= 64; // Header height
      
      if (shouldBeSticky !== isSticky.current) {
        isSticky.current = shouldBeSticky;
        filterRef.current.classList.toggle(styles.sticky, shouldBeSticky);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={filterRef} className={styles.categoryFilter}>
      <div className={styles.filterContainer}>
        <div className={styles.filterScroll}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${
                selectedCategory === category.id ? styles.active : ''
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}