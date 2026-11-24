import {useEffect, useState} from 'react';
import {
  DONE_COLUMN_ID,
  addCard,
  loadBoard,
  moveCard,
  removeCard,
  saveBoard,
  updateCardText,
} from '../boardData.js';
import AddCardForm from './AddCardForm.jsx';
import Column from './Column.jsx';

export default function Board() {
  const [board, setBoard] = useState(loadBoard);

  useEffect(() => {
    saveBoard(board);
  }, [board]);

  function handleCardDragStart(event, cardId) {
    event.dataTransfer.setData('text/plain', cardId);
    event.dataTransfer.effectAllowed = 'move';
  }

  function handleDropColumn(cardId, toColumnId) {
    setBoard((prev) => {
      const target = prev.columns.find((column) => column.id === toColumnId);
      if (!target) {
        return prev;
      }
      return moveCard(prev, cardId, toColumnId, target.cardIds.length);
    });
  }

  function handleAddCard(columnId, text) {
    setBoard((prev) => addCard(prev, columnId, text));
  }

  function handleDeleteCard(cardId) {
    setBoard((prev) => removeCard(prev, cardId));
  }

  function handleUpdateCard(cardId, text) {
    setBoard((prev) => updateCardText(prev, cardId, text));
  }

  return (
    <div className="kanban">
      <h1 className="kanban-title">Канбан-доска</h1>
      <AddCardForm columns={board.columns} onAdd={handleAddCard} />
      <div className="kanban-board">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            isDone={column.id === DONE_COLUMN_ID}
            cards={column.cardIds.map((id) => board.cards[id])}
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={() => undefined}
            onDropColumn={handleDropColumn}
            onDeleteCard={handleDeleteCard}
            onUpdateCard={handleUpdateCard}
          />
        ))}
      </div>
    </div>
  );
}
