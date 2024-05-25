import { createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  rol: string | null;
  avatar: string | null;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  username: null,
  rol: null,
  avatar: null,
};

export const authFeatureName = 'auth';

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.login, (state, { username, rol, avatar}) => ({
    ...state,
    isLoggedIn: true,
    username,
    rol,
    avatar
  })),
  on(authActions.logout, (state) => ({
    ...state,
    isLoggedIn: false,
    username: null,
    rol: null,
    avatar: null
  }))
);
