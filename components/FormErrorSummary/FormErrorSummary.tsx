import React, { useRef } from 'react';
import { ErrorSummary } from '@navikt/ds-react';
import * as classes from 'components/FormErrorSummary/FormErrorSummary.module.css';
import { useIntl } from 'react-intl';

export interface Error {
  path: string;
  message?: string;
  id: string;
}

interface Props {
  id: string;
  errors: Error[];
}

const FormErrorSummary = ({ id, errors }: Props) => {
  const { formatMessage } = useIntl();

  const errorSummaryElement = useRef(null);

  if (errors?.length < 1) {
    return (
      <ErrorSummary
        ref={errorSummaryElement}
        heading={formatMessage({ id: 'errorSummary.title' })}
        role={'alert'}
        aria-hidden={errors?.length === 0}
        className={errors?.length === 0 ? classes?.visuallyHidden : ''}
        id={id}
      >
        {'hidden'}
      </ErrorSummary>
    );
  }
  return (
    <div className={classes.row}>
      <div className={classes.container}>
        <ErrorSummary
          ref={errorSummaryElement}
          heading={formatMessage({ id: 'errorSummary.title' })}
          role={'alert'}
          aria-hidden={errors?.length === 0}
          className={errors?.length === 0 ? classes?.visuallyHidden : ''}
          id={id}
        >
          {errors.map((error, index) => (
            <ErrorSummary.Item key={index} href={`#${error.path}`}>
              {error.message}
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      </div>
    </div>
  );
};

export { FormErrorSummary };
