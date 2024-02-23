import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Link } from '@navikt/ds-react';
import React from 'react';
import { Vedlegg } from 'components/fileinput_v3/FileInputV3';

interface Props {
  file: Vedlegg;
  deleteUrl: string;
  readAttachmentUrl: string;
  onDelete: () => void;
}
export const FilePanelSuccess = ({ file, onDelete, deleteUrl, readAttachmentUrl }: Props) => {
  return (
    <Box background={'surface-default'} padding={'4'} style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        <div className={'fileCardLeftContent'}>
          <div className={'fileSuccess'}>
            <CheckmarkIcon color={'var(--a-icon-success)'} />
          </div>
          <div className={'fileInputText'}>
            <Link target={'_blank'} href={`${readAttachmentUrl}${file.vedleggId}`}>
              {file.name}
            </Link>
            <Detail>{fileSizeString(file.size)}</Detail>
          </div>
        </div>
        <button
          onClick={async () => {
            const res = await fetch(`${deleteUrl}${file.vedleggId}`, { method: 'DELETE' });
            if (res.ok) {
              onDelete();
            }
          }}
          type={'button'}
          tabIndex={0}
          className={'deleteAttachment'}
          data-testid={'slett-knapp'}
        >
          <XMarkIcon title={'Slett'} />
          <BodyShort>{'Slett'}</BodyShort>
        </button>
      </div>
    </Box>
  );
};

function fileSizeString(size: number) {
  const kb = size / 1024;
  return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
}
