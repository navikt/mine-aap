export const flatObj: any = (obj: any, prevKey = '') => {
  return Object.entries(obj).reduce((flatted, [key, value]) => {
    if (typeof value == 'object') {
      // @ts-ignore
      if (value?.message) {
        // @ts-ignore
        return { ...flatted, [`${prevKey ? prevKey + '.' : ''}${key}`]: value?.message };
      } else {
        return { ...flatted, ...flatObj(value, key) };
      }
    }
    console.log('flatted', flatted);
    return flatted;
  }, {});
};
