import {useState} from 'react';
import {ChevronIcon} from '../../icons';
import {shiftIndex, visibleItems} from './carouselUtils';
import styles from './Carousel.module.css';

/**
 * Закольцованная карусель: видно `visible` элементов, стрелки сдвигают на один.
 * Анимаций нет (так требует ТЗ), список просто пересобирается.
 */
export default function Carousel({items, renderItem, visible = 3, label}) {
  const [start, setStart] = useState(0);
  const canScroll = items.length > visible;
  const current = canScroll ? start % items.length : 0;
  const shown = visibleItems(items, current, visible);

  return (
    <div
      className={styles.carousel}
      role="group"
      aria-roledescription="карусель"
      aria-label={label}
    >
      <ul className={styles.list}>
        {shown.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </ul>
      {canScroll && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => setStart(shiftIndex(current, -1, items.length))}
            aria-label="Предыдущий товар"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => setStart(shiftIndex(current, 1, items.length))}
            aria-label="Следующий товар"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}
    </div>
  );
}
