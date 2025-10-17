import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FirstBranchSetup } from '../components/FirstBranchSetup'
import { AuthProvider } from '../hooks/useAuth'
import { BranchProvider } from '../hooks/useBranches'

// Simple test to verify the component renders
describe('FirstBranchSetup Component', () => {
  it('renders the setup form', () => {
    render(
      <AuthProvider>
        <BranchProvider>
          <FirstBranchSetup />
        </BranchProvider>
      </AuthProvider>
    )
    
      expect(screen.getByText('Welcome to StockFlow!')).toBeInTheDocument()
    expect(screen.getByText('Let\'s get started by creating your first branch. You can always add more branches later.')).toBeInTheDocument()
    expect(screen.getByLabelText('Company name *')).toBeInTheDocument()
  })

  it('has required form fields', () => {
    render(
      <AuthProvider>
        <BranchProvider>
          <FirstBranchSetup />
        </BranchProvider>
      </AuthProvider>
    )
    
    // Check that all expected fields are present
    expect(screen.getByLabelText('Bedrijfsnaam *')).toBeInTheDocument()
    expect(screen.getByLabelText(/Address/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone number/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/)).toBeInTheDocument()
  })

  it('has submit button', () => {
    render(
      <AuthProvider>
        <BranchProvider>
          <FirstBranchSetup />
        </BranchProvider>
      </AuthProvider>
    )
    
    const submitButton = screen.getByRole('button', { name: 'Create branch' })
    expect(submitButton).toBeInTheDocument()
  })
})
