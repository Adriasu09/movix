import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import copy from '@/config/copy.json';

const BIO_TRUNCATE_LENGTH = 600;

export const PersonBio = ({ biography }) => {
  const [expanded, setExpanded] = useState(false);

  if (!biography) {
    return (
      <section className="space-y-sm">
        <h2 className="font-display text-display-sm text-text-primary">
          {copy.personDetail.sections.bio}
        </h2>
        <p className="text-main-md text-text-muted italic">{copy.messages.noBio}</p>
      </section>
    );
  }

  const isLong = biography.length > BIO_TRUNCATE_LENGTH;
  const text = isLong && !expanded ? `${biography.slice(0, BIO_TRUNCATE_LENGTH)}…` : biography;

  return (
    <section className="space-y-sm">
      <h2 className="font-display text-display-sm text-text-primary">
        {copy.personDetail.sections.bio}
      </h2>
      <p className="text-main-md leading-relaxed whitespace-pre-line text-text-secondary">{text}</p>
      {isLong && (
        <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? copy.personDetail.bioReadLess : copy.personDetail.bioReadMore}
        </Button>
      )}
    </section>
  );
};
