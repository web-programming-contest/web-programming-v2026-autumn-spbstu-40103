import {useState} from 'react';

export default function Card({
  card,
  onDragStart,
  onDragEnd,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(card.text);

  function startEdit() {
    setDraft(card.text);
    setIsEditing(true);
  }

  function commitEdit() {
    const value = draft.trim();
    if (value !== '') {
      onUpdate(card.id, value);
    }
    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  }

  return (
    <article
      className="kanban-card"
      data-testid="kanban-card"
      data-card-id={card.id}
      draggable={!isEditing}
      onDragStart={(event) => onDragStart(event, card.id)}
      onDragEnd={onDragEnd}
    >
      {isEditing ? (
        <div className="card-edit">
          <input
            className="card-input"
            data-testid="card-edit-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            type="button"
            className="card-btn"
            data-testid="card-save"
            onClick={commitEdit}
          >
            Сохранить
          </button>
          <button
            type="button"
            className="card-btn"
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </button>
        </div>
      ) : (
        <>
          <p className="card-text">{card.text}</p>
          <div className="card-actions">
            <button
              type="button"
              className="card-btn"
              data-testid="card-edit"
              onClick={startEdit}
            >
              Изменить
            </button>
            <button
              type="button"
              className="card-btn card-btn-danger"
              data-testid="card-delete"
              onClick={() => onDelete(card.id)}
            >
              Удалить
            </button>
          </div>
        </>
      )}
    </article>
  );
}
