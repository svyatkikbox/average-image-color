export const each = (array, fn) => {
  const last = array.length - 1;
  const next = (i) => {
    setTimeout(() => {
      fn(array[i], i);
      if (i !== last) next(++i);
    }, 0);
  };
  next(0);
};
