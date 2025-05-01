# Bugs

## Known Bugs

- **Issue #1**: When the Game restarts, the default Magnets are not reset. They are not re-added into the game. No Idea why. For now, just restart the whole page.

### Related with Object Movement

- **Issue #2**: The Moving Walls do not get reset when the player loses or resets the game.
- **Issue #3**: The Moving Walls do not have a consistent pattern.
  - **Solved ✅**: The Moving Walls now have a consistent pattern. The problem was I used the body.position which is dynamic. I needed the origin static position. For this I created a Base Class called "Point" which simple accepts 2 parameters (x,y) and attached them to is fields.
- **Issue #4**: Moving Walls may experience Multiple calls per frame. This has the effect of making the Compounds drift. To fix we need to Ensure single call per frame.
- **Issue #5**: Moving Walls do no reset on restart, we nee to make them Reset to initial position.
- **Issue #6**: Moving Walls need more string type safety, to create a more robust and maintainable code. We should add same type guards.
