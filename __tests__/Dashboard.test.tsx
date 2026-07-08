import { render, screen, fireEvent } from '@testing-library/react'
import UnifiedDashboard from '../src/app/page'

describe('UnifiedDashboard', () => {
  it('renders Fan Experience tab by default', () => {
    render(<UnifiedDashboard />)
    
    // Check if tabs exist
    const fanTab = screen.getByRole('tab', { name: /Fan Experience/i })
    const staffTab = screen.getByRole('tab', { name: /Staff Operations/i })
    
    expect(fanTab).toBeInTheDocument()
    expect(staffTab).toBeInTheDocument()
    
    // Check default active state
    expect(fanTab).toHaveAttribute('aria-selected', 'true')
    
    // Check for fan content
    expect(screen.getByText('StadiaBot')).toBeInTheDocument()
    expect(screen.getByText('Find Restrooms')).toBeInTheDocument()
  })

  it('switches to Staff Operations tab when clicked', () => {
    render(<UnifiedDashboard />)
    
    const staffTab = screen.getByRole('tab', { name: /Staff Operations/i })
    fireEvent.click(staffTab)
    
    expect(staffTab).toHaveAttribute('aria-selected', 'true')
    
    // Check for staff content
    expect(screen.getByText('Operations AI')).toBeInTheDocument()
    expect(screen.getByText('Stadium Capacity')).toBeInTheDocument()
  })
})
