export interface Project {
  id: string;
  title: string;
  workType: string;
  image: string;
  alt: string;
  /** Количество обработанных фото проекта (01..count) — для слайдера. */
  count: number;
  /** Параметры объекта — заполняются только реальными данными. */
  area?: string;
  city?: string;
  duration?: string;
}

/** Полный список фото проекта для слайдера в лайтбоксе. */
export function projectImages(p: Project): string[] {
  const base = p.image.slice(0, p.image.lastIndexOf('/'));
  return Array.from({ length: p.count }, (_, i) => `${base}/${String(i + 1).padStart(2, '0')}.webp`);
}

export const projects: Project[] = [
  {
    id: 'pod-klutch',
    count: 9,
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/pod-klutch/01.webp',
    alt: 'Ремонт квартиры под ключ — пример выполненной работы'
  },
  {
    id: 'lyubertsy-rozhdestvenskaya',
    count: 16,
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lyubertsy-rozhdestvenskaya/02.webp',
    alt: 'Ремонт квартиры под ключ в Люберцах — пример выполненной работы',
    city: 'Люберцы'
  },
  {
    id: 'mytishchi-sanuzel',
    count: 10,
    title: 'Ремонт санузла',
    workType: 'Ремонт санузлов',
    image: '/images/projects/mytishchi-sanuzel/03.webp',
    alt: 'Ремонт санузла в Мытищах — пример выполненной работы',
    city: 'Мытищи'
  },
  {
    id: 'lytkarino-peschannaya',
    count: 10,
    title: 'Ремонт новостройки под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-peschannaya/04.webp',
    alt: 'Ремонт новостройки под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  },
  {
    id: 'vykhino-cosmetic',
    count: 8,
    title: 'Косметический ремонт квартиры',
    workType: 'Косметический ремонт',
    image: '/images/projects/vykhino-cosmetic/05.webp',
    alt: 'Косметический ремонт квартиры в Выхино — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'rublevskoe-dom',
    count: 10,
    title: 'Ремонт частного дома',
    workType: 'Ремонт под ключ',
    image: '/images/projects/rublevskoe-dom/02.webp',
    alt: 'Ремонт частного дома на Рублевском шоссе — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'lytkarino-6-mkr',
    count: 8,
    title: 'Ремонт студии под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lytkarino-6-mkr/03.webp',
    alt: 'Ремонт студии под ключ в Лыткарино — пример выполненной работы',
    city: 'Лыткарино'
  },
  {
    id: 'lyubertsy-116-kvartal',
    count: 6,
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/lyubertsy-116-kvartal/01.webp',
    alt: 'Ремонт квартиры под ключ в Люберцах — пример выполненной работы',
    city: 'Люберцы'
  },
  {
    id: 'butovo-cosmetic',
    count: 6,
    title: 'Косметический ремонт квартиры',
    workType: 'Косметический ремонт',
    image: '/images/projects/butovo-cosmetic/03.webp',
    alt: 'Косметический ремонт в Бутово — пример выполненной работы',
    city: 'Москва'
  },
  {
    id: 'vykhino-vtorichka',
    count: 8,
    title: 'Ремонт квартиры на вторичном рынке',
    workType: 'Ремонт под ключ',
    image: '/images/projects/vykhino-vtorichka/02.webp',
    alt: 'Ремонт квартиры на вторичном рынке — пример выполненной работы',
    city: 'Москва'
  }
];