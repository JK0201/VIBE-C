'use client';

import { useState } from 'react';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

export default function ImageGallery({ images, title = 'Product Image' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🖼️</div>
          <p>이미지가 없습니다</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageContainer}>
        <img
          src={images[selectedIndex]}
          alt={`${title} ${selectedIndex + 1}`}
          className={styles.mainImage}
        />
        
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              aria-label="이전 이미지"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="다음 이미지"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === selectedIndex ? styles.active : ''}`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`이미지 ${index + 1} 보기`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}