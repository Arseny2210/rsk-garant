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
    image: '/images/projects/lyubertsy-rozhdestvenskaya/02.webp',
    alt: 'Ремонт квартиры под ключ в Люберцах — пример выполненной работы',
    city: 'Люберцы'
  },
  {
    id: 'mytishchi-sanuzel',
    title: 'Ремонт санузла',
    workType: 'Ремонт санузлов',
    image: '/images/projects/mytishchi-sanuzel/03.webp',
    alt: 'Ремонт санузла в Мытищах — пример выполненной работы',
    city: 'Мытищи'
  },
  {
    id: 'lytkarino-peschannaya',
    title: 'Ремонт новостройки под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-peschannaya/04.webp',
    alt: 'Ремонт новостройки под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  },
  {
    id: 'vykhino-cosmetic',
    title: 'Косметический ремонт квартиры',
    workType: 'Косметический ремонт',
    image: '/images/projects/vykhino-cosmetic/05.webp',
    alt: 'Косметический ремонт квартиры в Выхино — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'rublevskoe-dom',
    title: 'Ремонт частного дома',
    workType: 'Ремонт под ключ',
    image: '/images/projects/rublevskoe-dom/02.webp',
    alt: 'Ремонт частного дома на Рублевском шоссе — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'lytkarino-6-mkr',
    title: 'Ремонт студии под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-6-mkr/03.webp',
    alt: 'Ремонт студии под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  },
  {
    id: 'lyubertsy-116-kvartal',
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lyubertsy-116-kvartal/01.webp',
    alt: 'Ремонт квартиры под ключ в Люберцах — пример выполненной работы',
    city: 'Люберцы'
  },
  {
    id: 'butovo-cosmetic',
    title: 'Косметический ремонт квартиры',
    workType: 'Косметический ремонт',
    image: '/images/projects/butovo-cosmetic/03.webp',
    alt: 'Косметический ремонт в Бутово — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'vykhino-vtorichka',
    title: 'Ремонт квартиры на вторичном рынке',
    workType: 'Ремонт под ключ',
    image: '/images/projects/vykhino-vtorichka/02.webp',
    alt: 'Ремонт квартиры на вторичном рынке — пример выполненной работы',
    city: 'Москва'
  }
];