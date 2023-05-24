import { XMarkIcon, TrashIcon, FileCheckmarkIcon, FileXMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Label, Link, Loader, Panel } from '@navikt/ds-react';
import { FieldArrayWithId, FieldErrors, UseFieldArrayRemove } from 'react-hook-form';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { fileSizeString } from '@navikt/aap-felles-utils-client';
import { TOTAL_FILE_SIZE, VedleggFormValues } from 'components/Inputs/FileUpload';
import * as styles from 'components/Inputs/FileUploadFields.module.css';
import { VedleggType } from 'lib/types/types';

interface Props {
  fields: FieldArrayWithId<VedleggFormValues>[] | undefined;
  krav: VedleggType;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<VedleggFormValues>;
}

export const FileUploadFields = ({ fields, krav, remove, errors }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();
  const totalFileSizeErrorMessage = errors?.[krav]?.[TOTAL_FILE_SIZE]?.message;
  return (
    <>
      <div className={totalFileSizeErrorMessage ? styles.containerError : undefined}>
        {fields?.map((attachment, index) => {
          const fieldHasError: boolean = errors?.[krav]?.fields?.[index]?.message !== undefined;
          return (
            <div key={attachment.id}>
              <Panel
                className={`${styles.fileCard} ${fieldHasError ?? styles?.error}`}
                key={attachment.id}
              >
                <div className={styles.fileCardLeftContent}>
                  {attachment.isUploading ? (
                    <>
                      <div>
                        <Loader />
                      </div>
                      <div>
                        <Label id={`${krav}.fields.${index}`}>{attachment.name}</Label>
                      </div>
                    </>
                  ) : (
                    <>
                      {fieldHasError ? (
                        <>
                          <div className={styles?.fileError}>
                            <FileXMarkIcon color={'var(--a-surface-danger-hover)'} />
                          </div>
                          <div>
                            <Label id={`${krav}.fields.${index}`}>{attachment.name}</Label>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles?.fileSuccess}>
                            <FileCheckmarkIcon color={'var(--a-icon-success)'} />
                          </div>
                          <div>
                            <Link
                              target={'_blank'}
                              href={`/aap/mine-aap/vedlegg/${attachment?.vedleggId}`}
                            >
                              {attachment?.name}
                            </Link>
                            <Detail>{fileSizeString(attachment?.size)}</Detail>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                {fieldHasError && (
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
                    <XMarkIcon title={formatMessage('filopplasting.vedlegg.avbryt')} />
                    <BodyShort>{formatMessage('filopplasting.vedlegg.avbryt')}</BodyShort>
                  </button>
                )}
                {!fieldHasError && !attachment.isUploading && (
                  <button
                    type={'button'}
                    onClick={() =>
                      fetch(`/aap/mine-aap/api/vedlegg/slett/?uuid=${attachment?.vedleggId}`, {
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
                    <TrashIcon title={formatMessage('filopplasting.vedlegg.slett')} />
                    <BodyShort>{formatMessage('filopplasting.vedlegg.slett')}</BodyShort>
                  </button>
                )}
              </Panel>
              {fieldHasError && (
                <div
                  className={`navds-error-message navds-error-message--medium navds-label ${styles.errorMessage}`}
                >
                  {errors?.[krav]?.fields?.[index]?.message}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalFileSizeErrorMessage && (
        <div
          className={`navds-error-message navds-error-message--medium navds-label ${styles.errorMessage}`}
          id={`${krav}.${TOTAL_FILE_SIZE}`}
        >
          {totalFileSizeErrorMessage}
        </div>
      )}
    </>
  );
};
