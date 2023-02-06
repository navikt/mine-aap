import React, { useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { ErrorSummary } from '@navikt/ds-react';
import * as classes from 'components/FormErrorSummary/FormErrorSummary.module.css';
import { flattenObject } from '@navikt/aap-felles-utils-client';
import { FormattedMessage } from 'react-intl';

const FormErrorSummary = (props: { id: string; errors: FieldErrors }) => {
  const flatErrors = flattenObject(props?.errors);
  const keyList = Object.keys(flatErrors).filter((key: string) => flatErrors[key] !== undefined);
  const errorSummaryElement = useRef(null);

  if (keyList?.length < 1) {
    return (
      <ErrorSummary
        ref={errorSummaryElement}
        heading={<FormattedMessage id="errorSummary.title" />}
        role={'alert'}
        aria-hidden={keyList?.length === 0}
        className={keyList?.length === 0 ? classes?.visuallyHidden : ''}
        {...props}
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
          heading={<FormattedMessage id="errorSummary.title" />}
          role={'alert'}
          aria-hidden={keyList?.length === 0}
          className={keyList?.length === 0 ? classes?.visuallyHidden : ''}
          {...props}
        >
          {keyList.map((key) => (
            <ErrorSummary.Item key={key} href={`#${key}`}>
              {
                // @ts-ignore
                flatErrors[key]
              }
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      </div>
    </div>
  );
};

export { FormErrorSummary };
