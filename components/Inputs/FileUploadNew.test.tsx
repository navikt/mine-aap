/*
- skal vise suksessmelding når man sender inn ettersendelse

- skal ikke vise fileinput etter at ettersendelse er sendt inn dersom krav ikke er ANNET

- skal vise fileinput etter at ettersendelse er sendt inn dersom krav er ANNET

- send knapp vises først når man har lagt til minst ett dokument

- send knapp vises ikke når krav ikke er ANNET og filer er lastet opp

- send knapp vises når krav er ANNET og filer allerede er lastet opp, og det er lagt til nye filer
 */

import { FileUploadNew } from 'components/Inputs/FileUploadNew';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { messages } from 'pages/_app';

const IntlWrapperMock = ({ children }: { children: React.JSX.Element }) => {
  return (
    <IntlProvider locale={'nb'} messages={messages['nb']}>
      {children}
    </IntlProvider>
  );
};
describe('FileUploadNew', () => {
  it('skal vise suksessmelding når man sender inn ettersendelse', () => {
    render(
      <IntlWrapperMock>
        <FileUploadNew
          krav={'UTLAND'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapperMock>
    );
  });
});
