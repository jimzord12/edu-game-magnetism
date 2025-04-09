// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="title">MagnetiX</h1>
        <p className="subtitle">
          Discover the fascinating world of magnetism through interactive
          puzzles
        </p>
      </header>

      <section className="info-section">
        <div className="info-card magnet-card">
          <h2>Magnetism</h2>
          <p>
            Magnets have two poles: North and South. Similar poles repel each
            other, while opposite poles attract. This fundamental principle
            powers everything from compasses to electric motors!
          </p>
        </div>

        <div className="info-card electro-card">
          <h2>Electromagnetism</h2>
          <p>
            When electricity flows through a wire, it creates a magnetic field.
            This relationship between electricity and magnetism is what makes
            modern technology possible, from speakers to generators.
          </p>
        </div>
      </section>

      <section className="navigation-section">
        <Link to="/levels" className="nav-button primary-button">
          Start Your Adventure
        </Link>
        <Link to="/sandbox" className="nav-button secondary-button">
          Experiment in Sandbox
        </Link>
      </section>

      <footer className="home-footer">
        <p>Learn through play. Discover the power of magnets!</p>
      </footer>
    </div>
  );
};

export default HomePage;
