import { BodyShort, Heading } from '@navikt/ds-react';

export const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

export const fileErrorTexts = {
  413: 'Filen er for stor',
  415: 'Filen er ikke gyldig',
  422: 'Inneholder virus',
  500: 'Det oppstod en feil',
};

export const validateFile = (file: File) => {
  if (!validFileTypes.includes(file.type)) {
    return 415;
  }
};

interface Props {
  heading?: string;
  description?: string;
}

export const FileInput = ({ heading, description }: Props) => {
  return (
    <div>
      {heading && (
        <Heading level="3" size="small" spacing>
          {heading}
        </Heading>
      )}
      {description && <BodyShort spacing>{description}</BodyShort>}

      <div>
        <>
          <input
            type="file"
            multiple
            onChange={(e) => console.log(e.target.files)}
            accept="image/*,.pdf"
          />
        </>
      </div>
    </div>
  );
};
