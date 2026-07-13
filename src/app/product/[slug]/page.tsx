import { Metadata } from 'next';
import ProductClient from './ProductClient';

interface PageProps {
  params: { slug: string };
}

// Generate static params for all products
export function generateStaticParams() {
  return [
    { slug: 'opc-43-grade-cement' },
    { slug: 'opc-53-grade-cement' },
    { slug: 'ppc-cement' },
    { slug: 'psc-cement' },
    { slug: 'white-cement' },
    { slug: 'ready-mix-cement' },
    { slug: 'tmt-bar-6mm' },
    { slug: 'tmt-bar-8mm' },
    { slug: 'tmt-bar-10mm' },
    { slug: 'tmt-bar-12mm' },
    { slug: 'tmt-bar-16mm' },
    { slug: 'tmt-bar-20mm' },
    { slug: 'tmt-bar-25mm' },
    { slug: 'tmt-bar-32mm' },
    { slug: 'ms-angle' },
    { slug: 'ms-channel' },
    { slug: 'ms-flat' },
    { slug: 'ms-square-bar' },
    { slug: 'ms-round-bar' },
    { slug: 'ms-plate' },
    { slug: 'ms-sheet' },
    { slug: 'chequered-plate' },
    { slug: 'iswb-beams' },
    { slug: 'h-beams' },
    { slug: 'gi-round-pipe' },
    { slug: 'gi-square-pipe' },
    { slug: 'gi-rectangle-pipe' },
    { slug: 'ms-round-pipe' },
    { slug: 'ms-square-pipe-structural' },
    { slug: 'erw-pipe' },
    { slug: 'vitrified-tiles' },
    { slug: 'double-charge-tiles' },
    { slug: 'gvt-tiles' },
    { slug: 'ceramic-tiles' },
    { slug: 'parking-tiles' },
    { slug: 'wall-tiles' },
    { slug: 'elevation-tiles' },
    { slug: 'aac-block-600x200x75' },
    { slug: 'aac-block-600x200x100' },
    { slug: 'aac-block-600x200x125' },
    { slug: 'aac-block-600x200x150' },
    { slug: 'aac-block-600x200x200' },
    { slug: 'plain-cement-sheets' },
    { slug: 'fibre-cement-sheets' },
    { slug: 'colour-coated-roofing-sheets' },
    { slug: 'galvanized-roofing-sheets' },
    { slug: 'upvc-roofing-sheets' },
    { slug: 'polycarbonate-roofing-sheets' },
    { slug: 'river-sand' },
    { slug: 'm-sand' },
    { slug: 'p-sand' },
    { slug: 'aggregate-20mm' },
    { slug: 'aggregate-12mm' },
    { slug: 'aggregate-10mm' },
    { slug: 'crusher-run-gsb' },
  ];
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const productNames: Record<string, string> = {
    'opc-43-grade-cement': 'OPC 43 Grade Cement - Premium Construction Cement | ASIF TRADERS',
    'opc-53-grade-cement': 'OPC 53 Grade Cement - High Strength Cement | ASIF TRADERS',
    // Add more as needed
  };

  return {
    title: productNames[params.slug] || 'Product - ASIF TRADERS',
    description: 'Shop premium building materials at ASIF TRADERS. Wholesale prices for cement, TMT bars, steel, pipes, tiles, AAC blocks and more.',
  };
}

export default function ProductPage({ params }: PageProps) {
  return <ProductClient slug={params.slug} />;
}
