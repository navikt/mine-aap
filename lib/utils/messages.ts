import messagesNb from 'lib/translations/nb.json';
import messagesNn from 'lib/translations/nn.json';
import { DecoratorLocale } from '@navikt/nav-dekoratoren-moduler';

type GenericMessageObject = {
  [key: string]: any;
};
function flattenMessages(nestedMessages: GenericMessageObject, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce<GenericMessageObject>((messages, key) => {
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

type Messages = Partial<Record<DecoratorLocale, { [name: string]: string }>>;

export const messages: Messages = {
  nb: flattenMessages(messagesNb),
  nn: flattenMessages(messagesNn),
};
