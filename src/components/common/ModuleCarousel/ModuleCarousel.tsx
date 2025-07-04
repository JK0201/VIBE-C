'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ModuleCarousel.module.css';

interface Module {
  id: number;
  category?: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  rating: number;
  downloads?: number;
  purchases?: number;
  gradient: string;
  icon: string;
}

interface ModuleCarouselProps {
  modules: Module[];
  showCategory?: boolean;
  itemsPerPage?: number;
}

export default function ModuleCarousel({ 
  modules, 
  showCategory = true,
  itemsPerPage = 4 
}: ModuleCarouselProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalPages = Math.ceil(modules.length / itemsPerPage);
  
  // Reset slide position when modules change
  useEffect(() => {
    setCurrentSlide(0);
  }, [modules]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalPages);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleModuleClick = (moduleId: number) => {
    router.push(`/marketplace/${moduleId}`);
  };

  if (modules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>이 카테고리에는 아직 등록된 모듈이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.carouselWrapper}>
        {modules.length > itemsPerPage && (
          <button 
            className={styles.carouselBtn} 
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        
        <div className={styles.componentCarousel}>
          <div 
            className={styles.componentSlider}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {modules.map((module) => (
              <div 
                key={module.id} 
                className={styles.componentCard}
                onClick={() => handleModuleClick(module.id)}
              >
                <div className={styles.componentImage}>
                  <div className={styles.imagePlaceholder} style={{background: module.gradient}}>
                    <span className={styles.imageIcon}>{module.icon}</span>
                  </div>
                  {showCategory && module.category && (
                    <div className={styles.componentCategory}>{module.category}</div>
                  )}
                </div>
                <div className={styles.componentContent}>
                  <h3 className={styles.componentTitle}>{module.title}</h3>
                  <p className={styles.componentDesc}>{module.description}</p>
                  <div className={styles.componentTags}>
                    {module.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                    {module.tags.length > 2 && (
                      <span className={styles.moreTag}>+{module.tags.length - 2}</span>
                    )}
                  </div>
                  <div className={styles.componentFooter}>
                    <div className={styles.componentPrice}>
                      <span className={styles.priceAmount}>{module.price.toLocaleString()}</span>
                      <span className={styles.priceUnit}>P</span>
                    </div>
                    <div className={styles.componentStats}>
                      <span className={styles.stat}>
                        <span className={styles.statIcon}>⭐</span>
                        {module.rating}
                      </span>
                      <span className={styles.stat}>
                        <span className={styles.statIcon}>💾</span>
                        {module.downloads || module.purchases || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {modules.length > itemsPerPage && (
          <button 
            className={styles.carouselBtn} 
            onClick={nextSlide}
            disabled={currentSlide === totalPages - 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
      
      {modules.length > itemsPerPage && (
        <div className={styles.carouselDots}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}