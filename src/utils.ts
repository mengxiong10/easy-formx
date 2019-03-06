export function getRules(prop: string, rules?: object, trigger?: string): any[] {
  if (!rules || !rules[prop]) {
    return [];
  }
  const result = Array.isArray(rules[prop]) ? rules[prop] : [rules[prop]];
  if (!trigger) {
    return result;
  }
  return result.filter((rule: any) => {
    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
  });
}

export function isRequired(prop: string, rules?: object) {
  let data = getRules(prop, rules);
  if (data.length) {
    for (let index = 0; index < data.length; index++) {
      const rule = data[index];
      if (rule.required) {
        return true;
      }
    }
  }
  return false;
}

export function getValidKeys(formValue: object, keys?: string | string[]) {
  const allKeys = Object.keys(formValue);
  if (!keys) {
    return allKeys;
  }
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  return keys.filter((v) => allKeys.indexOf(v) !== -1);
}

export function find<T>(arr: T[], fn: (v: T) => boolean) {
  for (const item of arr) {
    if (fn(item)) {
      return item;
    }
  }
  return undefined;
}
