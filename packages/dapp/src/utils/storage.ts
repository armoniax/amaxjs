const AsyncStorage = window.sessionStorage;

function clear() {
  return AsyncStorage.clear();
}
function isJson(str: string) {
  if (typeof str == 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}
function get(key: string, defaultValue?: any) {
  const value = AsyncStorage.getItem(key);
  if (String(value) === 'false') {
    return false;
  }
  if (value !== null && String(value) !== 'undefined' && !isJson(value)) {
    return value;
  }
  return value !== null
    ? String(value) === 'undefined'
      ? defaultValue
      : JSON.parse(value)
    : defaultValue;
}

function set(key: string, value: any) {
  if (typeof value === 'string') {
    return AsyncStorage.setItem(key, value);
  }
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string) {
  return AsyncStorage.removeItem(key);
}

function multiRemove(...keys: string[]) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiRemove,
};
