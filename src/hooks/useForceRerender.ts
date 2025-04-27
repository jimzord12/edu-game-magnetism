import { useState } from 'react';

const useForceRerender = () => {
  const [value, setForceRerender] = useState(false);

  const forceUpdate = () => {
    setForceRerender((prev) => !prev);
  };

  return { forceUpdate, value };
};

export default useForceRerender;
