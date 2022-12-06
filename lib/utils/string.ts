export const getStringFromPossiblyArrayQuery = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  }
  return query;
};

export const fileSizeString = (size: number) => {
  const kb = size / 1024;
  return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
};

export const getCommaSeparatedStringFromStringOrArray = (array: string | string[]) => {
  if (Array.isArray(array)) {
    return array.join(',');
  }
  return array;
};

export const replaceUUIDsInString = (string: string) => {
  const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
  return string.replace(regex, '[UUID]');
};
