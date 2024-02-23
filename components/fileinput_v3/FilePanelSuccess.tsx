import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Link, Select } from '@navikt/ds-react';
import React from 'react';
import { Vedlegg } from 'components/fileinput_v3/FileInputV3';
import { VedleggType } from 'lib/types/types';
import { useIntl } from 'react-intl';

interface Props {
  file: Vedlegg;
  deleteUrl: string;
  readAttachmentUrl: string;
  onDelete: () => void;
}
const vedleggstyper: VedleggType[] = ['STUDIER', 'ARBEIDSGIVER', 'OMSORG', 'UTLAND', 'ANDREBARN', 'ANNET'];
export const FilePanelSuccess = ({ file, onDelete, deleteUrl, readAttachmentUrl }: Props) => {
  const { formatMessage } = useIntl();

  const vedleggOptions: { label: string; value: VedleggType | undefined }[] = vedleggstyper.map((vedleggstype) => ({
    label: formatMessage({ id: `ettersendelse.vedleggstyper.${vedleggstype}.heading` }),
    value: vedleggstype,
  }));

  vedleggOptions.unshift({
    label: 'Hva inneholder dokumentet?',
    value: undefined,
  });

  return (
    <>
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
        <Select label={'Hva inneholder dokumentet?'}>
          {vedleggOptions.map((vedleggOption) => (
            <option value={vedleggOption.value} key={vedleggOption.label}>
              {vedleggOption.label}
            </option>
          ))}
        </Select>
      </Box>
    </>
  );
};

function fileSizeString(size: number) {
  const kb = size / 1024;
  return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
}
