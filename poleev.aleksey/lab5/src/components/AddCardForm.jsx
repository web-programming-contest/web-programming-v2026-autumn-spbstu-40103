import {useState} from 'react';

export default function AddCardForm({columns, onAdd}) {
  const [text, setText] = useState('');
  const [columnId, setColumnId] = useState(columns[0]?.id ?? '');

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim() === '') {
      return;
    }
    onAdd(columnId, text);
    setText('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="add-input"
        data-testid="kanban-input"
        type="text"
        name="text"
        placeholder="Текст новой карточки"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <select
        className="add-select"
        data-testid="kanban-column-select"
        name="column"
        value={columnId}
        onChange={(event) => setColumnId(event.target.value)}
      >
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.title}
          </option>
        ))}
      </select>
      <button type="submit" className="add-btn" data-testid="kanban-add">
        Добавить карточку
      </button>
    </form>
  );
}
