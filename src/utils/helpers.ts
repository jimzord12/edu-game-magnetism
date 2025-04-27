/**
 * Utility function that creates a promise that resolves after a specified delay
 * @param ms - The delay in milliseconds
 * @returns A promise that resolves after the specified delay
 */
const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getStoragePermission = async () => {
  if (navigator.storage && navigator.storage.persist) {
    const granted = await navigator.storage.persist();
    console.log('💾 OPFS persistence granted?', granted);
    return;
  }

  throw new Error('OPFS persistence not supported');
};

const getAverage = (nums: number[]): number => {
  const sum = nums.reduce((acc, num) => acc + num, 0);
  return sum / nums.length;
};

export { waitFor, getStoragePermission, getAverage };

export const removeById = <T extends { id: number }>(
  set: Set<T>,
  idToRemove: number
) => {
  for (const obj of set) {
    if (obj.id === idToRemove) {
      set.delete(obj);
      break; // stop once you’ve found & removed it
    }
  }

  return set;
};

export const toggleProperty = <T extends { id: number }>(
  set: Set<T>,
  idToRemove: number
) => {
  for (const obj of set) {
    if (obj.id === idToRemove) {
      set.delete(obj);
      break; // stop once you’ve found & removed it
    }
  }

  return set;
};
