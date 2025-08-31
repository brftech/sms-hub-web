import { Outlet, Link, useLocation } from 'react-router-dom'
import { useHub, HubLogo, HubSwitcher, Button } from '@sms-hub/ui'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
]

export function Layout() {
  const { hubConfig, currentHub } = useHub()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <HubLogo hubType={currentHub} variant="full" size="sm" />
              <HubSwitcher />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:hub-text-primary ${
                      isActive ? 'hub-text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="hub-bg-primary" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>

              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background">
              <nav className="flex flex-col space-y-1 px-4 py-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'hub-bg-primary text-white' 
                          : 'text-muted-foreground hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <HubLogo hubType={currentHub} variant="full" size="sm" />
              <p className="mt-2 text-sm text-muted-foreground">
                Enterprise SMS messaging platform powered by {hubConfig.displayName}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:hub-text-primary">Features</Link></li>
                <li><Link to="/pricing" className="hover:hub-text-primary">Pricing</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">API Docs</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:hub-text-primary">About</Link></li>
                <li><Link to="/contact" className="hover:hub-text-primary">Contact</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">Support</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:hub-text-primary">Privacy</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">Terms</Link></li>
                <li><Link to="#" className="hover:hub-text-primary">TCPA Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 {hubConfig.displayName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}