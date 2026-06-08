interface SeverityBadgeProps {
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  label?: string;
}

const CLASSES: Record<SeverityBadgeProps['severity'], string> = {
  mild:               'severity-mild',
  moderate:           'severity-moderate',
  severe:             'severity-severe',
  'life-threatening': 'severity-life-threatening',
};

const LABELS_ES: Record<SeverityBadgeProps['severity'], string> = {
  mild:               'Leve',
  moderate:           'Moderado',
  severe:             'Severo',
  'life-threatening': 'Potencialmente mortal',
};

export function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  return (
    <span className={CLASSES[severity]}>
      {label ?? LABELS_ES[severity]}
    </span>
  );
}
