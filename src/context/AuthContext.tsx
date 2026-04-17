import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isLoggedIn: true }
    case 'LOGOUT':
      return { user: null, isLoggedIn: false }
    case 'UPDATE_USER':
      if (!state.user) return state
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => boolean
  register: (firstName: string, lastName: string, email: string, password: string) => boolean
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('flagship_users') || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem('flagship_users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, isLoggedIn: false }, () => {
    try {
      const saved = localStorage.getItem('flagship_session')
      if (saved) {
        const user = JSON.parse(saved) as User
        return { user, isLoggedIn: true }
      }
    } catch {}
    return { user: null, isLoggedIn: false }
  })

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('flagship_session', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('flagship_session')
    }
  }, [state.user])

  function login(email: string, password: string): boolean {
    const users = getUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (found) {
      dispatch({ type: 'LOGIN', payload: found })
      return true
    }
    return false
  }

  function register(firstName: string, lastName: string, email: string, password: string): boolean {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      firstName,
      lastName,
      addresses: [],
      orderIds: [],
    }
    saveUsers([...users, newUser])
    dispatch({ type: 'LOGIN', payload: newUser })
    return true
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
  }

  function updateUser(data: Partial<User>) {
    if (!state.user) return
    const updated = { ...state.user, ...data }
    const users = getUsers()
    const idx = users.findIndex(u => u.id === state.user!.id)
    if (idx !== -1) {
      users[idx] = updated
      saveUsers(users)
    }
    dispatch({ type: 'UPDATE_USER', payload: data })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
