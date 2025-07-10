import styles from './DetailPageSkeleton.module.css';

export default function DetailPageSkeleton() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb skeleton */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbItem} style={{ width: '40px' }}></div>
        <div className={styles.breadcrumbDivider}></div>
        <div className={styles.breadcrumbItem} style={{ width: '80px' }}></div>
        <div className={styles.breadcrumbDivider}></div>
        <div className={styles.breadcrumbItem} style={{ width: '120px' }}></div>
      </div>

      <div className={styles.content}>
        {/* Main section */}
        <div className={styles.mainSection}>
          {/* Header skeleton */}
          <div className={styles.header}>
            <div className={styles.badges}>
              <div className={styles.badge} style={{ width: '60px' }}></div>
              <div className={styles.badge} style={{ width: '80px' }}></div>
            </div>
            <div className={styles.title}></div>
            <div className={styles.meta}>
              <div className={styles.metaItem} style={{ width: '150px' }}></div>
              <div className={styles.metaItem} style={{ width: '120px' }}></div>
            </div>
          </div>

          {/* Image gallery skeleton */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}></div>
            <div className={styles.thumbnails}>
              <div className={styles.thumbnail}></div>
              <div className={styles.thumbnail}></div>
              <div className={styles.thumbnail}></div>
              <div className={styles.thumbnail}></div>
            </div>
          </div>

          {/* Content sections skeleton */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}></div>
            <div className={styles.paragraph}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}></div>
            <div className={styles.paragraph}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className={styles.sidebar}>
          {/* Price/Info card skeleton */}
          <div className={styles.card}>
            <div className={styles.cardTitle}></div>
            <div className={styles.bigText}></div>
            <div className={styles.button}></div>
          </div>

          {/* Author/Company card skeleton */}
          <div className={styles.card}>
            <div className={styles.cardTitle}></div>
            <div className={styles.userInfo}>
              <div className={styles.avatar}></div>
              <div className={styles.userDetails}>
                <div className={styles.userName}></div>
                <div className={styles.userSub}></div>
              </div>
            </div>
          </div>

          {/* Status card skeleton */}
          <div className={styles.card}>
            <div className={styles.cardTitle}></div>
            <div className={styles.statusItems}>
              <div className={styles.statusItem}>
                <div className={styles.statusLabel}></div>
                <div className={styles.statusValue}></div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusLabel}></div>
                <div className={styles.statusValue}></div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusLabel}></div>
                <div className={styles.statusValue}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}