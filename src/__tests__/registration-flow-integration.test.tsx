import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { FirstBranchSetup } from '../components/FirstBranchSetup'
import { AuthProvider } from '../hooks/useAuth'
import { BranchProvider } from '../hooks/useBranches'

// Mock the hooks to simulate different states
const mockSetActiveBranch = vi.fn()
const mockRefreshBranches = vi.fn()

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
    userProfile: { id: 'test-user-id', role: 'admin' },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock useBranches hook
vi.mock('../hooks/useBranches', () => ({
  useBranches: () => ({
    branches: [],
    hasNoBranches: true,
    loading: false,
    setActiveBranch: mockSetActiveBranch,
    refreshBranches: mockRefreshBranches,
  }),
  BranchProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: { id: 'new-branch-id', name: 'My Company', is_main: true },
          error: null,
        })),
      })),
    })),
  })),
}

vi.mock('../integrations/supabase/client', () => ({
  supabase: mockSupabase,
}))

// Mock toast
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('sonner', () => ({
  toast: mockToast,
}))

describe('Registration and First Login Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows first branch setup when user has no branches', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Verify the setup screen is shown
    expect(screen.getByText('Welcome to StockFlow!')).toBeInTheDocument()
    expect(screen.getByText('Let\'s get started by creating your first branch. You can always add more branches later.')).toBeInTheDocument()
    
    // Verify form fields are present
    expect(screen.getByLabelText('Company name *')).toBeInTheDocument()
    expect(screen.getByLabelText(/Address/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone number/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/)).toBeInTheDocument()
    
    // Verify submit button is present but disabled initially
    const submitButton = screen.getByRole('button', { name: 'Create branch' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when branch name is provided', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    const branchNameInput = screen.getByLabelText('Company name *')
    const submitButton = screen.getByRole('button', { name: 'Create branch' })

    // Initially disabled
    expect(submitButton).toBeDisabled()

    // Type branch name
    await user.type(branchNameInput, 'My Company')

    // Should be enabled now
    expect(submitButton).not.toBeDisabled()
  })

  it('validates that branch name is required', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: 'Create branch' })

    // Should be disabled without branch name
    expect(submitButton).toBeDisabled()

    // Fill only optional fields
    await user.type(screen.getByLabelText(/Address/), '123 Main St')
    await user.type(screen.getByLabelText(/Phone number/), '+31 6 12345678')
    await user.type(screen.getByLabelText(/Email address/), 'info@company.com')

    // Should still be disabled
    expect(submitButton).toBeDisabled()
  })

  it('shows loading state during branch creation', async () => {
    const user = userEvent.setup()
    
    // Mock slow response
    mockSupabase.from.mockReturnValue({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => new Promise(resolve => 
            setTimeout(() => resolve({
              data: { id: 'new-branch-id', name: 'My Company', is_main: true },
              error: null,
            }), 100)
          )),
        })),
      })),
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Fill and submit form
    await user.type(screen.getByLabelText('Company name *'), 'My Company')
    await user.click(screen.getByRole('button', { name: 'Create branch' }))

    // Check loading state
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('handles form submission with all fields', async () => {
    const user = userEvent.setup()
    
    // Mock successful branch creation
    mockSupabase.from.mockReturnValueOnce({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'new-branch-id', name: 'My Company', is_main: true },
            error: null,
          })),
        })),
      })),
    }).mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Fill all form fields
    await user.type(screen.getByLabelText('Company name *'), 'My Company')


    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create branch' }))

    // Wait for async operations
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('branches')
      expect(mockSupabase.from).toHaveBeenCalledWith('branch_users')
    })

    expect(mockSetActiveBranch).toHaveBeenCalledWith({
      branch_id: 'new-branch-id',
      branch_name: 'My Company',
      is_main: true,
      user_role: 'admin',
    })

    expect(mockRefreshBranches).toHaveBeenCalled()
    expect(mockToast.success).toHaveBeenCalledWith('Your first branch has been successfully created!')
  })

  it('handles branch creation errors', async () => {
    const user = userEvent.setup()
    
    // Mock error response
    mockSupabase.from.mockReturnValue({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: { message: 'Database connection failed' },
          })),
        })),
      })),
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Fill and submit form
    await user.type(screen.getByLabelText('Company name *'), 'My Company')
    await user.click(screen.getByRole('button', { name: 'Create branch' }))

    // Wait for error handling
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'An error occurred: Database connection failed'
      )
    })
  })

  it('validates email format for optional email field', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <FirstBranchSetup />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    )

    // Fill branch name (required)
    await user.type(screen.getByLabelText('Company name *'), 'My Company')
    
    // Fill invalid email (should not prevent submission)
    await user.type(screen.getByLabelText(/Email address/), 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: 'Create branch' })
    expect(submitButton).not.toBeDisabled()
  })
})


