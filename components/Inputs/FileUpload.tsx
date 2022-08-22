import { useForm } from 'react-hook-form';
import { FormValues } from '../../pages/ettersendelse';
import { Vedleggskrav } from '../../types/types';
import { Section } from '../Section/Section';
import { FileInput } from './FileInput';

interface Props {
  krav: Vedleggskrav;
}
export const FileUpload = ({ krav }: Props) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <Section>
      <form
        onSubmit={handleSubmit(
          (data) => {
            console.log(data);
          },
          (error) => {
            //setErrorSummaryFocus();
          }
        )}
      >
        <FileInput
          heading={krav.dokumentasjonstype}
          description={krav.beskrivelse}
          name={krav.type}
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
        />
      </form>
    </Section>
  );
};
