# Magnetic Educational Game

An interactive physics-based educational game that teaches magnetism concepts through puzzle-solving and experimentation.

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

### Project Structure

```
src/
├── config/         # Game configuration and level definitions
├── features/       # Core game features
│   ├── games/      # Game modes implementations
│   ├── levels/     # Level management
│   ├── player/     # Player state management
│   └── sandbox/    # Sandbox mode implementation
├── models/         # Game object models
├── pages/          # Game pages/routes
└── store/          # Redux store configuration
```

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
