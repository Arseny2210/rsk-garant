export interface Project {
  id: string;
  title: string;
  workType: string;
  image: string;
  alt: string;
  /** Количество обработанных фото (01..count) — для слайдера. */
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
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/projects/pod-klutch/01.webp',
    alt: 'Ремонт квартиры под ключ — пример выполненной работы',
    count: 45
  },
  {
    id: 'sanuzel',
    title: 'Ремонт санузла',
    workType: 'Ремонт санузлов',
    image: '/images/projects/sanuzel/01.webp',
    alt: 'Ремонт санузла — пример выполненной работы',
    count: 7
  },
  {
    id: 'plitka',
    title: 'Плиточные работы',
    workType: 'Плиточные работы',
    image: '/images/projects/plitka/01.webp',
    alt: 'Плиточные работы — пример выполненной работы',
    count: 30
  },
  {
    id: 'oboi',
    title: 'Оклейка обоев',
    workType: 'Оклейка обоев',
    image: '/images/projects/oboi/01.webp',
    alt: 'Оклейка обоев — пример выполненной работы',
    count: 39
  },
  {
    id: 'laminat',
    title: 'Укладка ламината',
    workType: 'Укладка ламината',
    image: '/images/projects/laminat/01.webp',
    alt: 'Укладка ламината — пример выполненной работы',
    count: 22
  },
  {
    id: 'nat-potolki',
    title: 'Натяжные потолки',
    workType: 'Натяжные потолки',
    image: '/images/projects/nat-potolki/01.webp',
    alt: 'Натяжные потолки — пример выполненной работы',
    count: 35
  },
  {
    id: 'dveri',
    title: 'Установка дверей',
    workType: 'Установка дверей',
    image: '/images/projects/dveri/01.webp',
    alt: 'Установка дверей — пример выполненной работы',
    count: 23
  },
  {
    id: 'kosmet-rem',
    title: 'Косметический ремонт',
    workType: 'Косметический ремонт',
    image: '/images/projects/kosmet-rem/01.webp',
    alt: 'Косметический ремонт — пример выполненной работы',
    count: 29
  }
];