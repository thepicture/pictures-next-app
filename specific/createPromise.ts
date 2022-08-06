export const createPromise = () => {
  let resolver;
  return [
    new Promise((resolve) => {
      resolver = resolve;
    }),
    resolver,
  ];
};
