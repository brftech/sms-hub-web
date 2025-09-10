import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { createSupabaseClient } from '@sms-hub/supabase'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`

const Title = styled.h1`
  text-align: center;
  color: #1a202c;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  text-align: center;
  color: #718096;
  font-size: 16px;
  margin-bottom: 32px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`

const BackLink = styled.a`
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  margin-top: 20px;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`

export default function SuperadminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call the superadmin-auth Edge Function
      const { data, error: authError } = await supabase.functions.invoke('superadmin-auth', {
        body: { email, password }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!data.success) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Store superadmin session
      localStorage.setItem('superadmin_session', JSON.stringify(data.session))
      localStorage.setItem('superadmin_user', JSON.stringify(data.user))

      // Redirect to admin dashboard
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Superadmin Portal</Title>
        <Subtitle>SMS Hub API Management</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@sms-hub.com"
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
        
        <BackLink href="http://localhost:3000">
          ← Back to Main Site
        </BackLink>
      </LoginCard>
    </LoginContainer>
  )
}
