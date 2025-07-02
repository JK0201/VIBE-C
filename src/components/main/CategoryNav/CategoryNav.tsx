import styles from './CategoryNav.module.css';

const categories = [
  { id: 'website', name: '웹사이트', icon: '🌐' },
  { id: 'mobile', name: '모바일 앱', icon: '📱' },
  { id: 'ecommerce', name: '이커머스', icon: '🛒' },
  { id: 'ai', name: 'AI/ML', icon: '🤖' },
  { id: 'backend', name: '백엔드/API', icon: '⚙️' },
  { id: 'blockchain', name: '블록체인', icon: '⛓️' },
  { id: 'data', name: '데이터 분석', icon: '📊' },
  { id: 'devops', name: 'DevOps', icon: '🔧' },
];

export default function CategoryNav() {
  return (
    <section className={styles.categoryNav}>
      <div className={styles.categoryNavContent}>
        <h2 className={styles.categoryTitle}>
          어떤 서비스를 찾으시나요?
        </h2>
        <div className={styles.categoryNavGrid}>
          {categories.map((category) => (
            <a key={category.id} href="#" className={styles.categoryNavItem}>
              <div className={styles.categoryNavIcon}>
                <span className={styles.iconEmoji}>{category.icon}</span>
              </div>
              <span className={styles.categoryNavName}>{category.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}