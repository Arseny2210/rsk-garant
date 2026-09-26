export interface Project {
  id: string;
  title: string;
  workType: string;
  image: string;
  alt: string;
  /** Параметры объекта — заполняются только реальными данными. */
  area?: string;
  city?: string;
  duration?: string;
}

export const projects: Project[] = [
  {
    id: 'lyubertsy-rozhdestvenskaya',
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lyubertsy-rozhdestvenskaya/01.webp',
    alt: 'Ремонт квартиры под ключ в Люберцах — пример выполненной работы',
    city: 'Люберцы'
  },
  {
    id: 'mytishchi-sanuzel',
    title: 'Ремонт санузла',
    workType: 'Ремонт санузлов',
    image: '/images/projects/mytishchi-sanuzel/01.webp',
    alt: 'Ремонт санузла в Мытищах — пример выполненной работы',
    city: 'Мытищи'
  },
  {
    id: 'lytkarino-peschannaya',
    title: 'Ремонт новостройки под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-peschannaya/01.webp',
    alt: 'Ремонт новостройки под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  },
  {
    id: 'vykhino-cosmetic',
    title: 'Косметический ремонт квартиры',
    workType: 'Косметический ремонт',
    image: '/images/projects/vykhino-cosmetic/01.webp',
    alt: 'Косметический ремонт квартиры в Выхино — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'rublevskoe-dom',
    title: 'Ремонт частного дома',
    workType: 'Ремонт под ключ',
    image: '/images/projects/rublevskoe-dom/01.webp',
    alt: 'Ремонт частного дома на Рублевском шоссе — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'lytkarino-6-mkr',
    title: 'Ремонт студии под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-6-mkr/01.webp',
    alt: 'Ремонт студии под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  }
];