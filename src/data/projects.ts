import { readdirSync } from 'node:fs';
import { join } from 'node:path';

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

const PROJECTS_DIR = join(process.cwd(), 'public', 'images', 'projects');

/** Полный список фото проекта для слайдера в лайтбоксе (01..N.webp из папки). */
export function projectImages(p: Project): string[] {
  try {
    const files = readdirSync(PROJECTS_DIR + '/' + p.id)
      .filter((f) => f.endsWith('.webp'))
      .sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]));
    if (files.length > 0) return files.map((f) => `/images/projects/${p.id}/${f}`);
  } catch {
    /* папка отсутствует — используем обложку */
  }
  return [p.image];
}

export const projects: Project[] = [
  {
    id: 'pod-klutch',
    title: 'Ремонт квартиры под ключ',
    workType: 'Ремонт под ключ',
    image: '/images/covers/pod-klutch.webp',
    alt: 'Ремонт квартиры под ключ — пример выполненной работы'
  },
  {
    id: 'sanuzel',
    title: 'Ремонт санузла',
    workType: 'Ремонт санузлов',
    image: '/images/covers/sanuzel.webp',
    alt: 'Ремонт санузла — пример выполненной работы'
  },
  {
    id: 'plitka',
    title: 'Плиточные работы',
    workType: 'Плиточные работы',
    image: '/images/covers/plitka.webp',
    alt: 'Плиточные работы — пример выполненной работы'
  },
  {
    id: 'oboi',
    title: 'Оклейка обоев',
    workType: 'Оклейка обоев',
    image: '/images/covers/oboi.webp',
    alt: 'Оклейка обоев — пример выполненной работы'
  },
  {
    id: 'laminat',
    title: 'Укладка ламината',
    workType: 'Укладка ламината',
    image: '/images/covers/laminat.webp',
    alt: 'Укладка ламината — пример выполненной работы'
  },
  {
    id: 'nat-potolki',
    title: 'Натяжные потолки',
    workType: 'Натяжные потолки',
    image: '/images/covers/nat-potolki.webp',
    alt: 'Натяжные потолки — пример выполненной работы'
  },
  {
    id: 'dveri',
    title: 'Установка дверей',
    workType: 'Установка дверей',
    image: '/images/covers/dveri.webp',
    alt: 'Установка дверей — пример выполненной работы'
  },
  {
    id: 'kosmet-rem',
    title: 'Косметический ремонт',
    workType: 'Косметический ремонт',
    image: '/images/covers/kosmet-rem.webp',
    alt: 'Косметический ремонт — пример выполненной работы'
  }
];