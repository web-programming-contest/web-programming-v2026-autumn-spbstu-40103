// Класс варианта и функции работы с коллекцией программистов.

const LANGUAGE_OP_DELAY_MS = 300;

export class Programmer {
  constructor(id, name, languages = []) {
    this.id = Number(id);
    this.name = name;
    this.languages = [...languages];
  }

  get languageCount() {
    return this.languages.length;
  }

  addLanguage(language) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmed = String(language).trim();

        if (trimmed.length === 0) {
          reject(new Error('Название языка не может быть пустым.'));

          return;
        }

        const exists = this.languages.some(
          (item) => item.toLowerCase() === trimmed.toLowerCase(),
        );

        if (exists) {
          reject(new Error(`Язык ${trimmed} уже добавлен.`));

          return;
        }

        this.languages.push(trimmed);
        resolve(this.languages);
      }, LANGUAGE_OP_DELAY_MS);
    });
  }

  removeLanguage(language) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.languages.findIndex(
          (item) =>
            item.toLowerCase() === String(language).trim().toLowerCase(),
        );

        if (index === -1) {
          reject(new Error(`Язык ${language} не найден.`));

          return;
        }

        this.languages.splice(index, 1);
        resolve(this.languages);
      }, LANGUAGE_OP_DELAY_MS);
    });
  }
}

// Группировка: язык -> массив программистов.
export function groupProgrammersByLanguage(programmers) {
  const grouped = new Map();

  for (const programmer of programmers) {
    for (const language of programmer.languages) {
      const bucket = grouped.get(language) ?? [];
      bucket.push(programmer);
      grouped.set(language, bucket);
    }
  }

  return grouped;
}

// Уникальные языки всех программистов.
export function getUniqueLanguages(programmers) {
  const unique = new Set();

  for (const programmer of programmers) {
    for (const language of programmer.languages) {
      unique.add(language);
    }
  }

  return unique;
}

// Программисты, владеющие заданным языком.
export function findProgrammersByLanguage(programmers, language) {
  const wanted = String(language).trim().toLowerCase();

  return programmers.filter((programmer) =>
    programmer.languages.some((item) => item.toLowerCase() === wanted),
  );
}

// Группировка: количество языков -> массив программистов.
export function groupProgrammersByLanguageCount(programmers) {
  const grouped = new Map();

  for (const programmer of programmers) {
    const count = programmer.languageCount;
    const bucket = grouped.get(count) ?? [];
    bucket.push(programmer);
    grouped.set(count, bucket);
  }

  return grouped;
}

// Программисты с максимальным количеством языков.
export function findTopPolyglots(programmers) {
  if (programmers.length === 0) {
    return [];
  }

  const maxCount = Math.max(
    ...programmers.map((programmer) => programmer.languageCount),
  );

  return programmers.filter(
    (programmer) => programmer.languageCount === maxCount,
  );
}

// Асинхронное добавление программиста в коллекцию.
export function addProgrammer(programmers, programmer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const name = String(programmer.name).trim();

      if (name.length === 0) {
        reject(new Error('Имя программиста не может быть пустым.'));

        return;
      }

      const taken = programmers.some(
        (item) => item.id === Number(programmer.id),
      );

      if (taken) {
        reject(new Error(`Программист с id ${programmer.id} уже существует.`));

        return;
      }

      programmers.push(
        new Programmer(programmer.id, name, programmer.languages ?? []),
      );
      resolve(programmers);
    }, LANGUAGE_OP_DELAY_MS);
  });
}

// Асинхронное удаление программиста из коллекции.
export function removeProgrammer(programmers, id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = programmers.findIndex(
        (programmer) => programmer.id === Number(id),
      );

      if (index === -1) {
        reject(new Error(`Программист с id ${id} не найден.`));

        return;
      }

      const [removed] = programmers.splice(index, 1);
      resolve(removed);
    }, LANGUAGE_OP_DELAY_MS);
  });
}
