import { useCallback, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import {
  loginPlayer,
  createNewPlayer,
  logout,
  clearError,
} from '../features/player/slices/playerSlice';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { currentPlayer, loading } = useAppSelector((state) => state.player);
  const [error, setError] = useState<string | null>(null);
  const [gamePlayers, setGamePlayers] = useLocalStorage<string>(
    'gamePlayers',
    ''
  );

  // Clear any Redux errors when the hook mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (username.length > 20) {
      throw new Error('Username must be less than 20 characters');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new Error(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
    }
  };

  const login = useCallback(
    async (username: string) => {
      try {
        setError(null);
        validateUsername(username);
        await dispatch(loginPlayer(username)).unwrap();
        // Update local storage if not already present
        if (!gamePlayers.split(' ').includes(username)) {
          setGamePlayers((prev) => (prev ? `${prev} ${username}` : username));
        }
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to login';
        setError(message);
        return false;
      }
    },
    [dispatch, gamePlayers, setGamePlayers]
  );

  const createAccount = useCallback(
    async (username: string) => {
      try {
        setError(null);
        validateUsername(username);
        await dispatch(createNewPlayer(username)).unwrap();
        // Add to local storage after successful creation
        setGamePlayers((prev) => (prev ? `${prev} ${username}` : username));
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'Unknown error';

        let message = 'Failed to create account';
        if (errorMessage.includes('UNIQUE constraint failed')) {
          message = 'This username is already taken';
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
        return false;
      }
    },
    [dispatch, setGamePlayers]
  );

  const logoutUser = useCallback(() => {
    setError(null);
    dispatch(logout());
  }, [dispatch]);

  return {
    currentPlayer,
    isAuthenticated: !!currentPlayer,
    isLoading: loading,
    error,
    login,
    createAccount,
    logout: logoutUser,
    gamePlayers: gamePlayers.split(' ').filter(Boolean),
  };
};
