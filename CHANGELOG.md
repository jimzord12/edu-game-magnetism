# Change Log

## [0.3.0] - 2025-04-13

### Added

- Enhanced Quiz Game functionality
  - Added random selection of 10 questions per quiz attempt
  - Implemented "Try Again" functionality for quiz retakes
  - Added proper question shuffling mechanism
  - Added safeguards against quiz state errors

### Changed

- Modified quiz answer selection behavior
  - Removed immediate color feedback on answer selection
  - Allow answer changes before submission
  - Improved quiz state management and error handling
  - Enhanced quiz reset and retake functionality

### Fixed

- Fixed "Try Again" button error in quiz results screen
- Fixed quiz state initialization issues
- Fixed error when attempting to retake quiz before questions load

## [0.2.0] - 2025-04-13

### Added

- Enhanced player persistence with local storage sync
  - Players are now stored in both SQLite and localStorage
  - Automatic sync between storage methods on app startup
  - Improved error handling for duplicate usernames
  - Added `useLocalStorage` custom hook for managing browser storage
- New error handling mechanisms in authentication flow
  - Better error messages for duplicate usernames
  - Proper error state management between components
  - Added `clearError` action to Redux store

### Fixed

- Fixed bug allowing duplicate player names
- Fixed authentication error display on home page
- Improved error state management in useAuth hook

### Changed

- Updated player creation flow to check existing players before insertion
- Modified error handling in PlayerService to be more robust
- Enhanced App initialization to properly sync storage states
