import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

interface PageProps {
  params: { slug: string };
}

// Generate static params for all categories
export function generateStaticParams() {
  return [
    { slug: 'cement' },
    { slug: 'tmt-bars' },
    { slug: 'structural-steel' },
    { slug: 'gi-pipes' },
    { slug: 'ms-pipes' },
    { slug: 'tiles' },
    { slug: 'aac-blocks' },
    { slug: 'cement-sheets' },
    { slug: 'sand-aggregate' },
  ];
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryNames: Record<string, string> = {
    'cement': 'Cement Products - Premium Construction Cement',
    'tmt-bars': 'TMT Bars - High-Strength Reinforcement Bars',
    'structural-steel': 'Structural Steel - MS Angles, Channels & More',
    'gi-pipes': 'GI Pipes - Galvanized Iron Pipes',
    'ms-pipes': 'MS Pipes - Mild Steel Pipes',
    'tiles': 'Floor & Wall Tiles - Premium Collection',
    'aac-blocks': 'AAC Blocks - Lightweight Concrete Blocks',
    'cement-sheets': 'Cement Sheets & Roofing Solutions',
    'sand-aggregate': 'Sand & Aggregate - Construction Materials',
  };

  return {
    title: categoryNames[params.slug] || 'Category - ASIF TRADERS',
    description: 'Shop wholesale building materials at ASIF TRADERS. Premium cement, TMT bars, steel, pipes, tiles, AAC blocks and more with best prices.',
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryClient slug={params.slug} />;
}
