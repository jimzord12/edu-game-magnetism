export const idGen = function* () {
  let id = 0;
  while (true) {
    yield id;
    id += 1;
  }
};
