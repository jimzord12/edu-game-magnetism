# Contributing to Educational Magnetism Game

First off, thank you for considering contributing to our educational physics game! 🎮✨ This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Guidelines](#development-guidelines)
5. [Feature Development Guide](#feature-development-guide)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Commit Guidelines](#commit-guidelines)
9. [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

## Getting Started

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/edu-game-magnetism.git
cd edu-game-magnetism
```

3. Install dependencies:

```bash
npm install
```

4. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

## Project Structure

Our project follows a feature-first architecture. Here's how the main directories are organized:

```
src/
├── features/          # Feature modules
├── components/        # Shared components
├── models/           # Game object models
├── config/           # Game configuration
├── store/            # Redux store setup
├── hooks/            # Shared custom hooks
└── utils/            # Utility functions
```

## Development Guidelines

### Feature Module Structure

When creating a new feature, follow this structure:

```
src/features/your-feature/
├── components/        # Feature-specific components
├── hooks/            # Feature-specific hooks
├── slices/           # Redux slices (if needed)
├── utils/            # Feature-specific utilities
└── types.ts          # TypeScript types/interfaces
```

### Guidelines for Different Types of Contributions

#### 1. Adding a New Feature

1. Create a new directory in `src/features/`
2. Include all feature-specific code within this directory
3. Follow the established module structure:
   - `components/` - React components specific to this feature
   - `hooks/` - Custom hooks for feature logic
   - `slices/` - Redux slice if the feature needs state management
   - `types.ts` - TypeScript interfaces and types
   - `utils/` - Helper functions specific to the feature

Example:

```typescript
// src/features/newFeature/types.ts
export interface NewFeatureState {
  // ... type definitions
}

// src/features/newFeature/slices/newFeatureSlice.ts
import { createSlice } from '@reduxjs/toolkit';
// ... slice implementation

// src/features/newFeature/hooks/useNewFeature.ts
export const useNewFeature = () => {
  // ... hook implementation
};
```

#### 2. Adding New Game Objects

1. Create a new class in `src/models/`
2. Extend the appropriate base class (e.g., `Identifiable`)
3. Implement required interfaces
4. Add physics-related logic if needed

Example:

```typescript
import { Identifiable } from './base/Identifiable';

export class NewGameObject extends Identifiable {
  // ... implementation
}
```

#### 3. Adding New Game Mechanics

1. Update relevant configuration in `src/config/gameConfig.ts`
2. Implement physics logic in appropriate feature hooks
3. Add new Redux actions if state changes are needed
4. Update existing models or create new ones as needed

#### 4. Adding New Levels

1. Add level configuration in `src/config/levels.ts`
2. Follow the established level ID convention:
   - 100-199: Regular magnet levels
   - 200-299: Electromagnet levels

## Coding Standards

### TypeScript Guidelines

1. Use TypeScript for all new code
2. Define interfaces for all props and state
3. Use strict type checking
4. Avoid using `any`

### React Guidelines

1. Use functional components with hooks
2. Keep components focused and small
3. Use custom hooks for complex logic
4. Follow React best practices for performance

### State Management

1. Use Redux Toolkit for global state
2. Create feature slices for new state
3. Use local state for UI-only state
4. Follow the established action naming conventions

### Code Style

1. Use ESLint configuration
2. Use meaningful variable and function names
3. Comment complex logic
4. Write self-documenting code where possible

## Testing Guidelines

1. Write tests for new features
2. Include unit tests for utilities and models
3. Write integration tests for complex features
4. Test Redux slices thoroughly

Example test structure:

```typescript
describe('NewFeature', () => {
  it('should handle basic functionality', () => {
    // ... test implementation
  });
});
```

## Commit Guidelines

Follow conventional commits:

```
feat: add new magnetic field visualization
fix: correct ball collision detection
docs: update API documentation
style: format code according to guidelines
refactor: improve game engine performance
test: add unit tests for magnet class
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Add comments explaining complex logic
4. Request review from at least one maintainer
5. Address review comments promptly

### PR Description Template

```markdown
## Description

[Description of the changes]

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code cleanup

## Testing Done

[Describe the testing you've done]

## Screenshots (if applicable)

[Add screenshots]
```

## Questions?

If you have questions, feel free to:

1. Open an issue
2. Ask in discussions
3. Contact the maintainers

Thank you for contributing to making physics education more engaging and interactive! 🎮🧲✨
