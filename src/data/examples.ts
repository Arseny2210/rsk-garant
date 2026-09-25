export interface ExampleImage {
  src: string;
  alt: string;
}

export const serviceExamples: Record<string, ExampleImage[]> = {
  'remont-pod-klyuch': [
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Гостиная после комплексного ремонта квартиры' },
    { src: '/images/projects/project-01-posle.webp', alt: 'Ванная комната после ремонта под ключ' },
    { src: '/images/projects/project-04-potolki.webp', alt: 'Натяжной потолок в рамках ремонта квартиры' },
  ],
  'kosmeticheskiy-remont-komnaty': [
    { src: '/images/projects/project-02-posle.webp', alt: 'Комната после косметического ремонта' },
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Отделка комнаты после косметического ремонта' },
    { src: '/images/projects/project-04-potolki.webp', alt: 'Потолок, установленный при косметическом ремонте' },
  ],
  'remont-sanuzlov': [
    { src: '/images/projects/project-03-vannaya.webp', alt: 'Ванная комната с новой плиткой' },
    { src: '/images/projects/project-01-posle.webp', alt: 'Отремонтированный санузел' },
    { src: '/images/projects/project-05-dveri.webp', alt: 'Дверь, установленная при ремонте санузла' },
  ],
  'plitochnye-raboty': [
    { src: '/images/projects/project-03-vannaya.webp', alt: 'Укладка плитки в ванной комнате' },
    { src: '/images/projects/project-01-posle.webp', alt: 'Пример плиточных работ в санузле' },
    { src: '/images/projects/project-02-posle.webp', alt: 'Пример отделки стен при ремонте' },
  ],
  'okleyka-oboev': [
    { src: '/images/projects/project-02-posle.webp', alt: 'Комната после оклейки обоями' },
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Стены с отделкой в комнате' },
  ],
  'ukladka-laminata': [
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Напольное покрытие в комнате' },
    { src: '/images/projects/project-02-posle.webp', alt: 'Пол после укладки покрытия' },
  ],
  'natyazhnye-potolki': [
    { src: '/images/projects/project-04-potolki.webp', alt: 'Многоуровневый натяжной потолок со светильниками' },
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Натяжной потолок в гостиной' },
  ],
  'ustanovka-dverey': [
    { src: '/images/projects/project-05-dveri.webp', alt: 'Установленные межкомнатные двери' },
    { src: '/images/projects/project-06-kvartira.webp', alt: 'Межкомнатная дверь в интерьере' },
  ],
};