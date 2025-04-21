# Magnetic Educational Game

An interactive physics-based educational game that teaches magnetism concepts through puzzle-solving and experimentation.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Stack](#technical-stack)
- [Architecture](#architecture)
- [Development Setup](#development-setup)
- [Game Architecture](#game-architecture)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is a physics-based puzzle game where players manipulate magnetic fields to guide a ball to a target. It features two distinct game modes (regular magnets and electromagnets) and a sandbox environment for free experimentation with magnetic forces.

### Key Features

- **Two Game Modes:**
  - Regular Magnets: Place attracting/repelling magnets strategically
  - Electromagnets: Advanced mode with controllable magnetic field strength
- **Level-based Progression System**
- **Interactive Sandbox Mode**
- **Real-time Physics Simulation**
- **Visual Magnetic Field Representation**

## Technical Stack

- **Frontend Framework:** React + TypeScript + Vite
- **State Management:** Redux (Redux Toolkit)
- **Physics Engine:** Matter.js
- **Rendering:** p5.js
- **Database:** SQLite with Drizzle ORM
- **Testing:** Jest

## Architecture

### Design Patterns

1. **Redux Pattern (Flux Architecture)**

   - Feature-based slices organization
   - Centralized store configuration

2. **Feature-First Architecture**

   - Organized by features rather than technical types
   - Modular component structure

3. **Custom Hook Pattern**

   - `useGameEngineMagnet` - Game engine logic
   - `useSandboxEngine` - Sandbox environment
   - `useDB` - Database interactions

4. **Model-View Pattern**

   - Clear separation between models, views, and state management
   - Structured component hierarchy

5. **Inheritance & Composition**

   - Base `Identifiable` class
   - `Magnet` and `ElectroMagnet` class hierarchy
   - React component composition

6. **Singleton Pattern (`GameEngine.ts`)**
   - A dedicated `GameEngine` class (e.g., for Electromagnet mode) implemented as a Singleton ensures a single, persistent instance manages the physics simulation (Matter.js) and rendering (p5.js).
   - This decouples the core game loop and state from React's component lifecycle, preventing resets during UI updates or state changes (like pausing/resuming).
   - It holds the Matter.js engine, p5.js instance, game objects (ball, target, walls, magnets), and internal state (like game status and timer).
   - It provides methods (`initialize`, `update`, `updateMagnets`, `setGameStatus`, `resetBall`, etc.) controlled indirectly by React/Redux via a bridge hook (`useGameEngineBridge`).
   - Uses an observer pattern (callbacks like `onWin`) to notify the bridge hook of internal events.

#### Local Storage Sync Pattern

Utilizes a two-tier storage approach:

- SQLite database (via OPFS) for persistent, relational data
- LocalStorage for quick access and cross-tab synchronization
- Automatic sync on app initialization

#### Service Layer Pattern

Implements a robust service layer pattern for data management:

- Database services for CRUD operations
- Error handling and constraint validation
- Transaction management

#### Redux + Custom Hooks Pattern

Combines Redux state management with React hooks:

- Global state via Redux Toolkit
- Custom hooks for business logic
- Local state for UI components

### Project Structure

```
src/
├── config/           # Game configuration and level definitions
├── db/              # Database layer
│   ├── services/    # Database services
│   └── schema.ts    # Database schema definitions
├── features/        # Core game features
│   ├── games/       # Game modes implementations
│   ├── levels/      # Level management
│   ├── player/      # Player state management
│   └── sandbox/     # Sandbox mode implementation
├── hooks/           # Custom React hooks
├── models/          # Game object models
├── pages/          # Game pages/routes
└── store/          # Redux store configuration

```

### Authentication Flow

1. App Initialization:

   - Checks for existing database
   - Syncs players between LocalStorage and SQLite
   - Handles storage errors and constraints

2. Player Management:

   - Username-based authentication (no passwords)
   - Unique username constraints
   - Cross-tab state synchronization

3. Error Handling:
   - Graceful handling of duplicate usernames
   - Storage sync error recovery
   - Clear error state management

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd edu-game-magnetism
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:migrate
```

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:migrate` - Run database migrations

## Game Architecture

### Physics Implementation

The game uses Matter.js for physics simulation with custom implementations for:

- Magnetic force calculations
- Distance-based force falloff
- Collision detection
- Wall interactions

### Game Mechanics

1. **Regular Magnets Mode**

   - Place attracting (red) or repelling (blue) magnets
   - Strategic positioning to guide the ball
   - Limited number of magnets per level

2. **Electromagnets Mode**

   - Adjustable magnetic field strength
   - More complex puzzle solutions
   - Advanced physics interactions

3. **Sandbox Mode**
   - Free experimentation with magnetic forces
   - No restrictions on magnet placement
   - Educational tool for understanding magnetic fields

## Contributing

We welcome contributions! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

[Add your license here]
