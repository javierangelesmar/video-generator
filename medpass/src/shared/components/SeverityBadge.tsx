interface SeverityBadgeProps {
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  label?: string;
}

const CLASSES: Record<SeverityBadgeProps['severity'], string> = {
  mild: 'badge-mild',
  moderate: 'badge-moderate',
  severe: 'badge-severe',
  'life-threatening': 'inline-flex items-center rounded-full bg-red-900 px-2.5 py-0.5 text-xs font-medium text-white',
};

const LABELS: Record<SeverityBadgeProps['severity'], string> = {
  mild: 'Leve',
  moderate: 'Moderado',
  severe: 'Severo',
  'life-threatening': 'Potencialmente mortal',
};

export function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  return (
    <span className={CLASSES[severity]}>
      {label ?? LABELS[severity]}
    </span>
  );
}
