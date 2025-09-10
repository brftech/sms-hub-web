import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f7fafc;
`

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const UserName = styled.span`
  color: #4a5568;
  font-weight: 500;
`

const LogoutButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #c53030;
  }
`

const MainContent = styled.main`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const WelcomeCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`

const WelcomeTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
`

const WelcomeText = styled.p`
  color: #718096;
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
`

const CardDescription = styled.p`
  color: #718096;
  font-size: 14px;
  margin: 0 0 16px 0;
`

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  color: #718096;
  font-size: 14px;
`

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('superadmin_session')
    const userData = localStorage.getItem('superadmin_user')
    
    if (!session || !userData) {
      navigate('/login')
      return
    }

    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('superadmin_session')
    localStorage.removeItem('superadmin_user')
    navigate('/login')
  }

  const handleCardClick = (path: string) => {
    navigate(path)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardContainer>
      <Header>
        <Logo>SMS Hub API</Logo>
        <UserInfo>
          <UserName>Welcome, {user.first_name} {user.last_name}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <WelcomeCard>
          <WelcomeTitle>Admin Dashboard</WelcomeTitle>
          <WelcomeText>
            Manage your SMS Hub platform, users, and system settings from this central location.
          </WelcomeText>
        </WelcomeCard>

        <StatsGrid>
          <StatCard>
            <StatValue>1</StatValue>
            <StatLabel>Superadmins</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Companies</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Campaigns</StatLabel>
          </StatCard>
        </StatsGrid>

        <Grid>
          <Card onClick={() => handleCardClick('/superadmins')}>
            <CardIcon style={{ background: '#667eea', color: 'white' }}>
              👑
            </CardIcon>
            <CardTitle>Superadmin Management</CardTitle>
            <CardDescription>
              Manage superadmin users, roles, and permissions
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('/users')}>
            <CardIcon style={{ background: '#48bb78', color: 'white' }}>
              👥
            </CardIcon>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage platform users and their accounts
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('/companies')}>
            <CardIcon style={{ background: '#ed8936', color: 'white' }}>
              🏢
            </CardIcon>
            <CardTitle>Company Management</CardTitle>
            <CardDescription>
              Manage companies and their settings
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('/campaigns')}>
            <CardIcon style={{ background: '#9f7aea', color: 'white' }}>
              📱
            </CardIcon>
            <CardTitle>Campaign Management</CardTitle>
            <CardDescription>
              Monitor and manage SMS campaigns
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('/analytics')}>
            <CardIcon style={{ background: '#38b2ac', color: 'white' }}>
              📊
            </CardIcon>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              View platform usage and performance metrics
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('/settings')}>
            <CardIcon style={{ background: '#718096', color: 'white' }}>
              ⚙️
            </CardIcon>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure platform settings and integrations
            </CardDescription>
          </Card>
        </Grid>
      </MainContent>
    </DashboardContainer>
  )
}
