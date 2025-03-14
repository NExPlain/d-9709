
import _ from 'lodash';

/**
 * A collection of utility functions using lodash
 */

// Array operations
export const getUniqueItems = <T>(array: T[]): T[] => {
  return _.uniq(array);
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return _.chunk(array, size);
};

// Object operations
export const mergeObjects = <T>(object: T, ...sources: any[]): T => {
  return _.merge({}, object, ...sources);
};

export const pickProperties = <T extends object, K extends keyof T>(
  object: T, 
  keys: K[]
): Pick<T, K> => {
  return _.pick(object, keys);
};

// String operations
export const capitalizeString = (string: string): string => {
  return _.capitalize(string);
};

export const truncateString = (string: string, length: number): string => {
  return _.truncate(string, { length });
};

// Collection operations
export const sortByProperty = <T>(collection: T[], property: keyof T): T[] => {
  return _.sortBy(collection, [property]);
};

export const groupByProperty = <T>(collection: T[], property: keyof T): _.Dictionary<T[]> => {
  return _.groupBy(collection, property);
};

// Function utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): _.DebouncedFunc<T> => {
  return _.debounce(func, wait);
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): _.DebouncedFunc<T> => {
  return _.throttle(func, wait);
};
