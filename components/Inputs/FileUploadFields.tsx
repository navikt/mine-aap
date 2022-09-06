import { Cancel, Delete, FileError, FileSuccess } from '@navikt/ds-icons';
import { BodyShort, Detail, Label, Link, Panel } from '@navikt/ds-react';
import { FieldArrayWithId, FieldErrors, UseFieldArrayRemove } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { fileSizeString } from 'lib/utils/string';
import { VedleggFormValues } from 'components/Inputs/FileUpload';
import * as styles from 'components/Inputs/FileUploadFields.module.css';

interface Props {
  fields: FieldArrayWithId<VedleggFormValues, 'vedlegg', 'id'>[] | undefined;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<VedleggFormValues>;
}

export const FileUploadFields = ({ fields, remove, errors }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();

  return (
    <>
      {fields?.map((attachment, index) => {
        const fieldHasError = errors?.vedlegg?.[index]?.message !== undefined;
        return (
          <div key={attachment.id}>
            <Panel
              className={`${styles.fileCard} ${fieldHasError ?? styles?.error}`}
              key={attachment.id}
            >
              <div className={styles.fileCardLeftContent}>
                {fieldHasError ? (
                  <>
                    <div className={styles?.fileError}>
                      <FileError color={'var(--navds-semantic-color-interaction-danger-hover)'} />
                    </div>
                    <div>
                      <Label id={`vedlegg.${index}`}>{attachment.name}</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles?.fileSuccess}>
                      <FileSuccess color={'var(--navds-semantic-color-feedback-success-icon)'} />
                    </div>
                    <div>
                      <Link
                        target={'_blank'}
                        href={`/aap/innsyn/vedleggvisning/${attachment?.vedleggId}`}
                      >
                        {attachment?.name}
                      </Link>
                      <Detail>{fileSizeString(attachment?.size)}</Detail>
                    </div>
                  </>
                )}
              </div>
              {fieldHasError ? (
                <button
                  type={'button'}
                  onClick={() => {
                    remove(index);
                  }}
                  tabIndex={0}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      remove(index);
                    }
                  }}
                  className={styles?.deleteAttachment}
                >
                  <Cancel title={formatMessage('filopplasting.vedlegg.avbryt')} />
                  <BodyShort>{formatMessage('filopplasting.vedlegg.avbryt')}</BodyShort>
                </button>
              ) : (
                <button
                  type={'button'}
                  onClick={() =>
                    fetch(`/aap/innsyn/api/vedlegg/slett/?uuid=${attachment?.vedleggId}`, {
                      method: 'DELETE',
                    }).then(() => remove(index))
                  }
                  tabIndex={0}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      remove(index);
                    }
                  }}
                  className={styles?.deleteAttachment}
                >
                  <Delete title={formatMessage('filopplasting.vedlegg.slett')} />
                  <BodyShort>{formatMessage('filopplasting.vedlegg.slett')}</BodyShort>
                </button>
              )}
            </Panel>
            {fieldHasError && (
              <div className={'navds-error-message navds-error-message--medium navds-label'}>
                {errors?.vedlegg?.[index]?.message}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
