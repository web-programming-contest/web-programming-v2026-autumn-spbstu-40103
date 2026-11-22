import Carousel from '../Carousel/Carousel';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductRow.module.css';

// status: 'loading' | 'ready' | 'error'
// icon: { src, width, height, frame } — размер задаём явно, файл в 4 раза больше (для чёткости на Retina)
export default function ProductRow({
  icon,
  title,
  text,
  goods,
  status,
  onRetry,
  lightTiles = false,
  introTop = 54,
}) {
  return (
    <section className={styles.row} aria-label={title}>
      <div className={styles.intro} style={{paddingTop: introTop}}>
        <span className={styles['icon-frame']} style={{height: icon.frame}}>
          <img src={icon.src} width={icon.width} height={icon.height} alt="" />
        </span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
      </div>

      {status === 'ready' && goods.length > 0 && (
        <Carousel
          items={goods}
          label={title}
          renderItem={(good) => (
            <ProductCard good={good} lightTile={lightTiles} />
          )}
        />
      )}
      {status === 'ready' && goods.length === 0 && (
        <p className={styles.status}>Пока здесь пусто</p>
      )}
      {status === 'loading' && (
        <p className={styles.status}>Загружаем товары…</p>
      )}
      {status === 'error' && (
        <div className={styles.status}>
          <p>Не удалось загрузить товары</p>
          <button type="button" className={styles.retry} onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}
    </section>
  );
}
