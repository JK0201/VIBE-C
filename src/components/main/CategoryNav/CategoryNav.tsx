'use client';

import { useRouter } from 'next/navigation';
import styles from './CategoryNav.module.css';

const categories = [
  { id: 'sns', name: 'SNS', icon: '💬' },
  { id: 'automation', name: 'Automation', icon: '🔧' },
  { id: 'web-app', name: 'Web/App', icon: '🌐' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'ui-ux', name: 'UI/UX', icon: '🎨' },
  { id: 'data', name: 'Data', icon: '📊' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
  { id: 'fintech', name: 'Fintech', icon: '💰' },
  { id: 'b2b', name: 'B2B', icon: '🏢' },
];

export default function CategoryNav() {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/marketplace?category=${categoryId}`);
  };

  return (
    <section className={styles.categoryNav}>
      <div className={styles.categoryNavContent}>
        <h2 className={styles.categoryTitle}>
          어떤 서비스를 찾으시나요?
        </h2>
        <div className={styles.categoryNavGrid}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={styles.categoryNavItem}
            >
              <div className={styles.categoryNavIcon}>
                <span className={styles.iconEmoji}>{category.icon}</span>
              </div>
              <span className={styles.categoryNavName}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}