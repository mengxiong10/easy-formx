export function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null;
}

export function set(obj: any, keyString: string, value: any) {
  if (!isObject(obj)) {
    return obj;
  }
  let paths;
  if (Object.prototype.hasOwnProperty.call(obj, keyString)) {
    paths = [keyString];
  } else {
    paths = keyString.replace(/(\w)\[(\d+)\]/g, '$1.$2').split('.');
  }

  const length = paths.length;
  const lastIndex = length - 1;
  let index = -1;
  let nested = obj;
  while (++index < length && nested != null) {
    const key = paths[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue = isObject(objValue) ? objValue : +paths[index + 1] >= 0 ? [] : {};
    }
    Object.assign(nested, { [key]: newValue });
    nested = nested[key];
  }
  return obj;
}

export function flattenObject(
  path = '',
  obj: any,
  match: (key: string) => boolean,
  callback: (key: string, value: any) => any
) {
  if (match(path)) {
    callback(path, obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((value, index) => flattenObject(`${path}[${index}]`, value, match, callback));
  } else if (isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      flattenObject(`${path}${path ? '.' : ''}${key}`, value, match, callback);
    });
  }
}
