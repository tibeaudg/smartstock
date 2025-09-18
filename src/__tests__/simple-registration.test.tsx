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
    
    expect(screen.getByText('Welkom bij StockFlow!')).toBeInTheDocument()
    expect(screen.getByText('Laten we beginnen door je eerste vestiging aan te maken. Je kunt later altijd meer vestigingen toevoegen.')).toBeInTheDocument()
    expect(screen.getByLabelText('Bedrijfsnaam *')).toBeInTheDocument()
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
    expect(screen.getByLabelText(/Adres/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Telefoonnummer/)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mailadres/)).toBeInTheDocument()
  })

  it('has submit button', () => {
    render(
      <AuthProvider>
        <BranchProvider>
          <FirstBranchSetup />
        </BranchProvider>
      </AuthProvider>
    )
    
    const submitButton = screen.getByRole('button', { name: 'Vestiging aanmaken' })
    expect(submitButton).toBeInTheDocument()
  })
})
