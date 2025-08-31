// Utility for lazy loading components with proper error boundaries
// Note: This is a placeholder - React lazy loading should be implemented in the consuming app
export function lazyImport<
  T extends any,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: factory().then((module) => ({ default: module[name] })),
  });
}

// Preload function for critical components
export function preloadComponent<T extends any>(
  importFunc: () => Promise<{ default: T }>
) {
  return () => {
    return importFunc().then((module) => module.default);
  };
}
