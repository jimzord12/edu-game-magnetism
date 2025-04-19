import { useState } from 'react';

const useForceRerender = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setForceRerender] = useState(false);

  const forceUpdate = () => {
    setForceRerender((prev) => !prev);
  };

  return { forceUpdate };
};

export default useForceRerender;
