'use client';

import { useState, useRef, useEffect } from 'react';
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
}

export default function ModuleCarousel({ 
  modules, 
  showCategory = true
}: ModuleCarouselProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  // Calculate items per page based on viewport
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(4);
      } else if (width >= 768) {
        setItemsPerPage(3);
      } else if (width >= 480) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // Update current page on scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = scrollContainer.firstElementChild?.clientWidth || 0;
      const gap = 16; // 1rem gap
      const firstVisibleIndex = Math.round(scrollLeft / (itemWidth + gap));
      const currentPage = Math.floor(firstVisibleIndex / itemsPerPage);
      setCurrentIndex(currentPage);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [itemsPerPage]);

  const scrollToPage = (pageIndex: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const itemWidth = scrollContainer.firstElementChild?.clientWidth || 0;
    const gap = 16; // 1rem gap
    const targetIndex = pageIndex * itemsPerPage;
    scrollContainer.scrollTo({
      left: targetIndex * (itemWidth + gap),
      behavior: 'smooth'
    });
  };

  const handleModuleClick = (moduleId: number) => {
    // Don't navigate if we were dragging
    if (isDragging) return;
    router.push(`/marketplace/${moduleId}`);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    const currentScrollLeft = scrollContainerRef.current?.scrollLeft || 0;
    setScrollLeft(currentScrollLeft);
    setDragStartScrollLeft(currentScrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Snap to nearest page after drag for desktop
    if (window.innerWidth >= 768) {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;
      
      const itemWidth = scrollContainer.firstElementChild?.clientWidth || 0;
      const gap = 16;
      const currentScrollLeft = scrollContainer.scrollLeft;
      const dragDistance = currentScrollLeft - dragStartScrollLeft;
      const threshold = (itemWidth + gap) * 0.2; // 20% threshold
      
      // Calculate current page
      const currentPage = Math.round(dragStartScrollLeft / ((itemWidth + gap) * itemsPerPage));
      let targetPage = currentPage;
      
      // Determine target page based on drag direction and distance
      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          // Dragged left (scrolled right)
          targetPage = Math.min(currentPage + 1, Math.ceil(modules.length / itemsPerPage) - 1);
        } else {
          // Dragged right (scrolled left)
          targetPage = Math.max(currentPage - 1, 0);
        }
      }
      
      const targetIndex = targetPage * itemsPerPage;
      scrollContainer.scrollTo({
        left: targetIndex * (itemWidth + gap),
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Natural scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (modules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>이 카테고리에는 아직 등록된 모듈이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className={`${styles.scrollContainer} ${isDragging ? styles.dragging : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {modules.map((module) => (
          <div 
            key={module.id} 
            className={styles.moduleCard}
            onClick={() => handleModuleClick(module.id)}
          >
            <div className={styles.moduleImage}>
              <div className={styles.imagePlaceholder} style={{background: module.gradient}}>
                <span className={styles.imageIcon}>{module.icon}</span>
              </div>
              {showCategory && module.category && (
                <div className={styles.moduleCategory}>{module.category}</div>
              )}
            </div>
            
            <div className={styles.moduleContent}>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.moduleDesc}>{module.description}</p>
              
              <div className={styles.moduleTags}>
                {module.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
                {module.tags.length > 2 && (
                  <span className={styles.moreTag}>+{module.tags.length - 2}</span>
                )}
              </div>
              
              <div className={styles.moduleFooter}>
                <div className={styles.modulePrice}>
                  <span className={styles.priceAmount}>{module.price.toLocaleString()}</span>
                  <span className={styles.priceUnit}>P</span>
                </div>
                <div className={styles.moduleStats}>
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
      
      {/* Dots Indicator */}
      {(() => {
        const totalPages = Math.ceil(modules.length / itemsPerPage);
        return totalPages > 1 ? (
          <div className={styles.dotsContainer}>
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
                aria-label={`현재 ${totalPages}페이지 중 ${index + 1}페이지`}
              />
            ))}
          </div>
        ) : null;
      })()}
    </div>
  );
}