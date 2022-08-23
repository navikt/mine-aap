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
