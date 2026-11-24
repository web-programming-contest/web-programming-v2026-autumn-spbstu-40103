import coverMaster from '../assets/book1.jpg';
import coverCrime from '../assets/book2.jpg';
import cover1984 from '../assets/book3.jpg';
import coverPrince from '../assets/book4.jpg';
import coverWar from '../assets/book5.jpg';
import coverPotter from '../assets/book6.jpg';

export const books = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    year: 1967,
    genre: 'Роман',
    pages: 480,
    cover: coverMaster,
    description:
      'Чёрт приезжает в Москву 1930-х, а параллельно разворачивается история Понтия Пилата и Иешуа.',
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    year: 1866,
    genre: 'Роман',
    pages: 592,
    cover: coverCrime,
    description:
      'История бедного студента Раскольникова, решившегося на убийство, и его нравственных мучений.',
  },
  {
    id: 3,
    title: '1984',
    author: 'Джордж Оруэлл',
    year: 1949,
    genre: 'Антиутопия',
    pages: 328,
    cover: cover1984,
    description:
      'Тоталитарное общество, где за мыслями следит Большой Брат, а история переписывается каждый день.',
  },
  {
    id: 4,
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    year: 1943,
    genre: 'Сказка',
    pages: 96,
    cover: coverPrince,
    description:
      'Философская сказка о мальчике с далёкой планеты и о том, что действительно важно в жизни.',
  },
  {
    id: 5,
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    genre: 'Роман-эпопея',
    pages: 1274,
    cover: coverWar,
    description:
      'Судьбы нескольких семей на фоне наполеоновских войн и перемен в русском обществе.',
  },
  {
    id: 6,
    title: 'Гарри Поттер и философский камень',
    author: 'Джоан Роулинг',
    year: 1997,
    genre: 'Фэнтези',
    pages: 332,
    cover: coverPotter,
    description:
      'Мальчик-сирота узнаёт, что он волшебник, и отправляется учиться в Хогвартс.',
  },
];
