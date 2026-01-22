import { FileText, Barcode, ClipboardCheck } from 'lucide-react';

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  pdfPath: string;
  icon: React.ComponentType<{ className?: string }>;
  source: string;
  points?: string[];
}

export const leadMagnets: LeadMagnet[] = [
  {
    id: 'inventory-count-checklist',
    title: 'Inventory Count Checklist',
    description: 'Complete inventory count checklist template to ensure accurate stocktaking and minimize errors during physical inventory counts.',
    pdfPath: '/lead-magnets/inventory-count-checklist.pdf',
    icon: ClipboardCheck,
    source: 'inventory-count-checklist',
    points: [
      'Pre-count preparation steps',
      'Count day procedures',
      'Post-count reconciliation',
      'Common mistakes to avoid',
      'Best practices for accuracy'
    ]
  },
  {
    id: 'barcode-label-template',
    title: 'Barcode Label Template',
    description: 'Professional barcode label template for printing. Includes standard formats and sizing guidelines for optimal scanning performance.',
    pdfPath: '/lead-magnets/barcode-label-template.pdf',
    icon: Barcode,
    source: 'barcode-label-template',
    points: [
      'Standard label dimensions',
      'Barcode format specifications',
      'Print quality guidelines',
      'Placement recommendations',
      'Compatibility with scanners'
    ]
  },
  {
    id: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'Step-by-step onboarding checklist for new inventory management systems. Streamline your implementation process and ensure nothing is missed.',
    pdfPath: '/lead-magnets/onboarding-checklist.pdf',
    icon: FileText,
    source: 'onboarding-checklist',
    points: [
      'Initial setup tasks',
      'Data migration steps',
      'Team training requirements',
      'Integration checklist',
      'Go-live preparation'
    ]
  }
];

export const getLeadMagnetById = (id: string): LeadMagnet | undefined => {
  return leadMagnets.find(magnet => magnet.id === id);
};

export const getLeadMagnetBySource = (source: string): LeadMagnet | undefined => {
  return leadMagnets.find(magnet => magnet.source === source);
};








