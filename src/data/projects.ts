export interface Project {
  id: string;
  title: string;
  workType: string;
  image: string;
  alt: string;
  before?: string;
  after?: string;
  /** Параметры объекта — заполняются только реальными данными. */
  area?: string;
  city?: string;
  duration?: string;
}

export const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Ремонт ванной комнаты',
    workType: 'Плиточные работы, сантехника',
    image: '/images/projects/project-01-posle.webp',
    alt: 'Отремонтированная ванная комната после ремонта',
    before: '/images/projects/project-01-do.webp',
    after: '/images/projects/project-01-posle.webp'
  },
  {
    id: 'project-02',
    title: 'Косметический ремонт комнаты',
    workType: 'Оклейка обоев, напольное покрытие',
    image: '/images/projects/project-02-posle.webp',
    alt: 'Комната после косметического ремонта',
    before: '/images/projects/project-02-do.webp',
    after: '/images/projects/project-02-posle.webp'
  },
  {
    id: 'project-03',
    title: 'Ремонт ванной с укладкой плитки',
    workType: 'Плиточные работы',
    image: '/images/projects/project-03-vannaya.webp',
    alt: 'Ванная комната с новой плиткой после ремонта'
  },
  {
    id: 'project-04',
    title: 'Многоуровневый натяжной потолок',
    workType: 'Натяжные потолки, освещение',
    image: '/images/projects/project-04-potolki.webp',
    alt: 'Многоуровневый натяжной потолок со встроенным освещением'
  },
  {
    id: 'project-05',
    title: 'Установка межкомнатных дверей',
    workType: 'Установка дверей',
    image: '/images/projects/project-05-dveri.webp',
    alt: 'Установленные межкомнатные двери в квартире'
  },
  {
    id: 'project-06',
    title: 'Комплексный ремонт квартиры',
    workType: 'Ремонт под ключ',
    image: '/images/projects/project-06-kvartira.webp',
    alt: 'Гостиная после комплексного ремонта квартиры'
  }
];