import {useState} from 'react';
import Card from './Card.jsx';

export default function Column({
  column,
  cards,
  isDone,
  onCardDragStart,
  onCardDragEnd,
  onDropColumn,
  onDeleteCard,
  onUpdateCard,
}) {
  const [isOver, setIsOver] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (!isOver) {
      setIsOver(true);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsOver(false);
    const cardId = event.dataTransfer.getData('text/plain');
    if (cardId !== '') {
      onDropColumn(cardId, column.id);
    }
  }

  const dropClass = isDone ? 'column-drop column-drop-done' : 'column-drop';

  return (
    <section className="kanban-column" data-testid="kanban-column">
      <h2 className="column-title">{column.title}</h2>
      <div
        className={dropClass}
        data-testid={isDone ? 'kanban-done' : 'column-drop-area'}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onDelete={onDeleteCard}
            onUpdate={onUpdateCard}
          />
        ))}
        {isOver && <p className="column-hint">Отпустите здесь</p>}
        {cards.length === 0 && !isOver && <p className="column-empty">Пусто</p>}
      </div>
    </section>
  );
}
