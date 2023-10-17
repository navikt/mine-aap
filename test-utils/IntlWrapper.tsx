import React from 'react';
import { IntlProvider } from 'react-intl';
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
