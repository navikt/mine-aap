import { Skeleton } from '@navikt/ds-react';

export const SkeletonDokumentOversikt = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <Skeleton variant="rectangle" width="200px" height="80px" />
    <Skeleton variant="rectangle" width="150px" height="50px" />
    <Skeleton variant="rounded" width="100%" height="76px" />
    <Skeleton variant="rounded" width="100%" height="76px" />
    <Skeleton variant="rounded" width="100%" height="76px" />
  </div>
);
