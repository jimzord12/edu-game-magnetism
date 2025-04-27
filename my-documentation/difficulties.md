I had numerous difficulties with the following:

- Making the following to play well together:
  - React
  - Redux
  - p5.js (the rendering engine)
  - Matter.js (the physics engine)

At the beginning, I was using p5.js for both rendering and physics inside a custom hook.

- I noticed an issue where the p5 Instance and the Matter.js engine were recreated on every render, causing performance issues and unexpected behavior.
- I had to refactor the code and created a class named `GameEngineElectro` that encapsulates the p5.js instance and the Matter.js engine.
- The issue now was to connect it with React and Redux.
- This was done by creating a custom hook that uses the `useEffect` and `useRef` hooks to manage the lifecycle of the p5.js instance and the Matter.js engine.
- I created callback functions that would call the Redux actions to update the state when the game state changes (e.g., when a magnet is moved or a ball is created). I gave these function to the `GameEngineElectro` class and called them from the p5.js instance.
- A tremendous difficulty which results in spending approx. 10 hours to solve, was relaying on AI to generate the code for the `GameEngineElectro` class.
- It did seem to work at first, but once I need to add more features, and to specific, to make the magnets draggable. This required to create a Matter.js MouseConstraint and to add it to the engine, and also change the isStatic property of the magnets while dragging.
- I had done everything right, but the AI had added a condition on a multiconditional if statement that was preventing the engine to update, which was resulting in the magnets not be draggable.
