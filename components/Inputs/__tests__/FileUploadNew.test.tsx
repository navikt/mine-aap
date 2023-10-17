/*
- skal vise suksessmelding når man sender inn ettersendelse

- skal ikke vise fileinput etter at ettersendelse er sendt inn dersom krav ikke er ANNET

- skal vise fileinput etter at ettersendelse er sendt inn dersom krav er ANNET

- send knapp vises først når man har lagt til minst ett dokument

- send knapp vises ikke når krav ikke er ANNET og filer er lastet opp

- send knapp vises når krav er ANNET og filer allerede er lastet opp, og det er lagt til nye filer
 */

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { FileUploadNew } from 'components/Inputs/FileUploadNew';
import messagesNb from 'lib/translations/nb.json';

function flattenMessages(nestedMessages: object, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    // @ts-ignore
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // @ts-ignore
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

export const IntlWrapper = ({ children }: { children: React.JSX.Element }) => {
  return (
    <IntlProvider locale={'nb'} messages={flattenMessages(messagesNb)}>
      {children}
    </IntlProvider>
  );
};

describe('FileUpload', () => {
  it('skal vise suksessmelding når man sender inn ettersendelse', () => {
    render(
      <IntlWrapper>
        <FileUploadNew
          krav={'UTLAND'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
  });
});
