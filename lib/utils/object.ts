export const flattenObject = (
  object: Record<string, unknown>,
  prevKey = ''
): Record<string, string> => {
  return Object.entries(object).reduce((flattenedObject, [key, value]) => {
    const keyWithPrefix = `${prevKey ? prevKey + '.' : ''}${key}`;
    if (!value) {
      return { ...flattenedObject, [keyWithPrefix]: value };
    }
    if (typeof value === 'object') {
      // @ts-ignore
      if (value?.message) {
        // @ts-ignore
        return { ...flattenedObject, [keyWithPrefix]: value?.message };
      }
      // @ts-ignore
      return { ...flattenedObject, ...flattenObject(value, keyWithPrefix) };
    }
    return flattenedObject;
  }, {});
};
