/**
 * V1 Static Product ID → Backend Product UUID mapping
 *
 * V1 uses slug-style IDs (e.g. "opc-43-grade") in its static data.
 * The backend uses Prisma UUIDs (e.g. "cmrgoh4i0009vz4ioelkg3m8w").
 *
 * This map is used at checkout / order placement time to translate
 * V1 IDs into the IDs the backend understands.
 */

const PRODUCT_ID_MAP: Record<string, string> = {
  // TMT Bars
  'tmt-6mm': 'cmrgoh77500apz4iopr5ucw9z',
  'tmt-8mm': 'cmrgoh83g00axz4iobi1obg9s',
  'tmt-10mm': 'cmrgoh8tc00b5z4iof130cr6c',
  'tmt-12mm': 'cmrgoh9ja00bdz4iomg6eceo6',
  'tmt-16mm': 'cmrgohafm00blz4io2lwnlkp5',
  'tmt-20mm': 'cmrgohb5h00btz4iop7y1nv44',
  'tmt-25mm': 'cmrgohbvd00c1z4ioh1cv74kl',
  'tmt-32mm': 'cmrgohclj00c9z4io77oenfgv',
  // Structural Steel
  'ms-angle': 'cmrgohdbh00chz4ion1vhb5ux',
  'ms-flat': 'cmrgohg7700ddz4io3usd70g1',
  'ms-square-bar': 'cmrgohhmz00dtz4ioe95ng3vl',
  'ms-round-bar': 'cmrgog08k00e7vliwdyukt0ub',
  'ms-plate': 'cmrgog1x800envliw4amlglfu',
  'ms-sheet': 'cmrgog3f200f3vliwtbyrmmo1',
  'chequered-plate': 'cmrgog4q500fhvliwehrto7tw',
  'h-beams': 'cmrgog5uh00ftvliwaf0mvnu1',
  // GI / MS Pipes
  'gi-round-pipe': 'cmrgog75k00g7vliwih1eplny',
  'gi-square-pipe': 'cmrgog97k00gtvliwfz1ynyvl',
  'gi-rectangle-pipe': 'cmrgogaim00h7vliwvsj10ljz',
  'ms-round-pipe': 'cmrgogbtr00hlvliw4oicdu8u',
  'ms-square-pipe-structural': 'cmrgogdp400i3vliw47go3pcq',
  'erw-pipe': 'cmrgogf0700ihvliwoelis95m',
  // Tiles
  'vitrified-tiles': 'cmrgoggb900ivvliwsbks6a4k',
  'double-charge-tiles': 'cmrgoghfr00j7vliwkl1cc6ly',
  'gvt-tiles': 'cmrgogide00jhvliwthigoc3a',
  'ceramic-tiles': 'cmrgogjhr00jtvliwfl22hjr3',
  'parking-tiles': 'cmrgogkfl00k3vliwbnvdxqoy',
  'wall-tiles': 'cmrgogl6i00kbvliworb8m3yq',
  'elevation-tiles': 'cmrgogmb400knvliwmovhi9wv',
  // AAC Blocks
  'aac-block-75mm': 'cmrgognfg00kzvliw1b2qu3qd',
  'aac-block-100mm': 'cmrgogojz00l9vliwan21fnra',
  'aac-block-125mm': 'cmrgogphl00ljvliwp4qroukm',
  'aac-block-150mm': 'cmrgogqlw00ltvliwku9uzgi0',
  'aac-block-200mm': 'cmrgogrji00m3vliwx4t3toac',
  // Roofing sheets
  'plain-cement-sheets': 'cmrgogsh400mdvliwxnp17qpv',
  'fibre-cement-sheets': 'cmrgogtlk00mpvliwaes4vejp',
  'colour-coated-roofing': 'cmrgogupy00n1vliwctzdenxl',
  'galvanized-roofing': 'cmrgogvnk00nbvliw5x5u3fw6',
  'upvc-roofing': 'cmrgogwl700nlvliwahxhg0ni',
  'polycarbonate-roofing': 'cmrgogxit00nvvliw181688lr',
  // Sand & Aggregate
  'river-sand': 'cmrgogyn500o7vliwwb44lczl',
  'm-sand': 'cmrgogzl000ohvliwjgbb4an3',
  'p-sand': 'cmrgoh0pb00orvliwji9da3zq',
  'aggregate-20mm': 'cmrgoh1my00p1vliwhfwghogd',
  'aggregate-12mm': 'cmrgoh2kl00pbvliwnzsvjgki',
  'aggregate-10mm': 'cmrgoh3ia00plvliw0v9dalpv',
  'crusher-run': 'cmrgoh4fv00pvvliw7bij9z82',
  // Cement (Roff OPC 43 — the only one with both V1 and backend)
  'opc-43-grade': 'cmrgoh4i0009vz4ioelkg3m8w',
};

export function toBackendId(v1Id: string): string {
  return PRODUCT_ID_MAP[v1Id] || v1Id;
}

export function hasBackendId(v1Id: string): boolean {
  return !!PRODUCT_ID_MAP[v1Id];
}

export { PRODUCT_ID_MAP };
