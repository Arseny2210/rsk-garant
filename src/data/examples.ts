import { projects, projectImages } from './projects';

export interface ExampleImage {
  src: string;
  alt: string;
}

const SERVICE_FOLDER: Record<string, string> = {
  'remont-pod-klyuch': 'pod-klutch',
  'kosmeticheskiy-remont-komnaty': 'kosmet-rem',
  'remont-sanuzlov': 'sanuzel',
  'plitochnye-raboty': 'plitka',
  'okleyka-oboev': 'oboi',
  'ukladka-laminata': 'laminat',
  'natyazhnye-potolki': 'nat-potolki',
  'ustanovka-dverey': 'dveri',
};

/** Все фото категории для блока «Примеры работ» на лендинге услуги. */
export function serviceImages(serviceId: string): ExampleImage[] {
  const folder = SERVICE_FOLDER[serviceId];
  const project = projects.find((p) => p.id === folder);
  if (!project) return [];
  return projectImages(project).map((src, i) => ({
    src,
    alt: `${project.alt} — фото ${i + 1}`,
  }));
}