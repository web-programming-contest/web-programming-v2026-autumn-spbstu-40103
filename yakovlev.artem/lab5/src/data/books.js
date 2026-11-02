import crimeAndPunishment from '../../assets/cover-crime-and-punishment.svg';
import warAndPeace from '../../assets/cover-war-and-peace.svg';
import deadSouls from '../../assets/cover-dead-souls.svg';
import eugeneOnegin from '../../assets/cover-eugene-onegin.svg';
import heroOfOurTime from '../../assets/cover-hero-of-our-time.svg';
import cherryOrchard from '../../assets/cover-cherry-orchard.svg';

export const books = [
  {
    id: 1,
    title: 'Преступление и наказание',
    author: 'Ф. М. Достоевский',
    year: 1866,
    cover: crimeAndPunishment,
    description:
      'Роман о бедном студенте Раскольникове, который решается на преступление ради собственной теории, и о том, какую цену ему приходится за это заплатить.',
  },
  {
    id: 2,
    title: 'Война и мир',
    author: 'Л. Н. Толстой',
    year: 1869,
    cover: warAndPeace,
    description:
      'Роман-эпопея о судьбах нескольких дворянских семей на фоне наполеоновских войн и Отечественной войны 1812 года.',
  },
  {
    id: 3,
    title: 'Мёртвые души',
    author: 'Н. В. Гоголь',
    year: 1842,
    cover: deadSouls,
    description:
      'Поэма о Чичикове, который разъезжает по губернии и скупает «мёртвые» крепостные души, и сатирическая картина помещичьей России.',
  },
  {
    id: 4,
    title: 'Евгений Онегин',
    author: 'А. С. Пушкин',
    year: 1833,
    cover: eugeneOnegin,
    description:
      'Роман в стихах о молодом столичном дворянине Онегине и Татьяне Лариной, история несложившейся любви.',
  },
  {
    id: 5,
    title: 'Герой нашего времени',
    author: 'М. Ю. Лермонтов',
    year: 1840,
    cover: heroOfOurTime,
    description:
      'Роман о Печорине — умном, скучающем и разочарованном офицере, и о его встречах на Кавказе.',
  },
  {
    id: 6,
    title: 'Вишнёвый сад',
    author: 'А. П. Чехов',
    year: 1904,
    cover: cherryOrchard,
    description:
      'Пьеса о разорении дворянской семьи и продаже родового имения с вишнёвым садом.',
  },
];
