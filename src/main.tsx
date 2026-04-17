import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './index.css'
import App from './App.tsx'

const clientSideID = import.meta.env.VITE_LD_CLIENT_ID ?? ''

async function bootstrap() {
  // Restore session user for LD context
  let ldUser: { key: string; email?: string; name?: string; anonymous?: boolean } = {
    key: 'anonymous',
    anonymous: true,
  }

  try {
    const session = localStorage.getItem('flagship_session')
    if (session) {
      const user = JSON.parse(session)
      ldUser = {
        key: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        anonymous: false,
      }
    }
  } catch {}

  let LDProvider: React.ComponentType<{ children: React.ReactNode }>

  if (clientSideID) {
    try {
      LDProvider = await asyncWithLDProvider({
        clientSideID,
        context: { kind: 'user', ...ldUser },
        options: { streaming: true },
      })
    } catch {
      LDProvider = ({ children }) => <>{children}</>
    }
  } else {
    // No LD client ID — flags will use defaults
    LDProvider = ({ children }) => <>{children}</>
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename="/flagship-store">
        <LDProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LDProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

bootstrap()
