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

/**
 * Makes a specific property of an object read-only at runtime using Object.defineProperty.
 * This prevents future assignments to the property.
 * Note: This modifies the object in place.
 *
 * @template T The type of the object.
 * @template K The key (property name) of the object to make read-only. Must be a key of T.
 * @param {T} obj The object to modify.
 * @param {K} propName The name of the property to make read-only.
 * @param {boolean} [makeNonConfigurable=true] Optional. If true (default), also makes the property non-configurable,
 *                                            preventing deletion and further re-definition. Set to false if you
 *                                            only want to prevent writing but allow potential future configuration.
 * @returns {T} The modified object (although modification happens in place).
 * @throws {Error} If the property does not exist directly on the object.
 */
export function makePropertyReadonly<T extends object, K extends keyof T>(
  obj: T,
  propName: K,
  makeNonConfigurable: boolean = true
): T {
  // Get the current value of the property. This handles potential getters correctly.
  const currentValue = obj[propName];

  // Get the original property descriptor to preserve attributes like enumerability.
  // We need 'as string | symbol' because defineProperty keys can be symbols too,
  // and keyof T can resolve to symbol | string | number.
  const descriptor = Object.getOwnPropertyDescriptor(
    obj,
    propName as string | symbol
  );

  if (!descriptor) {
    // This function is intended for existing 'own' properties.
    // Throw an error if the property isn't found directly on the object.
    // It won't work reliably for properties inherited from the prototype chain
    // without potentially affecting all instances.
    throw new Error(
      `Property '${String(
        propName
      )}' not found directly on the object instance.`
    );
  }

  // Define the property with writable set to false
  Object.defineProperty(obj, propName as string | symbol, {
    value: currentValue, // Set the value explicitly
    writable: false, // *** Make it non-writable ***
    configurable: !makeNonConfigurable, // Make it non-configurable by default
    enumerable: descriptor.enumerable, // Preserve original enumerability
  });

  // Return the object, although it was modified in place.
  return obj;
}

// Make 'apiKey' readonly at runtime
// makePropertyReadonly(myConfig, 'apiKey');
// You could also do: const updatedConfig = makePropertyReadonly(myConfig, 'apiKey');
