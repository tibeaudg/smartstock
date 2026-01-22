import { supabase } from '@/integrations/supabase/client';

export interface InactiveUser {
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  last_login: string | null;
  onboarding: string | null;
}

/**
 * Exports inactive users to CSV format for manual email outreach
 * 
 * Criteria for inactive users:
 * - onboarding is NULL or 'in_progress'
 * - last_login is NULL or older than 30 days
 * 
 * @returns Promise<string> - CSV formatted string with user data
 */
export async function exportInactiveUsers(): Promise<string> {
  try {
    // Query for inactive users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    const { data: users, error } = await supabase
      .from('profiles')
      .select('email, first_name, last_name, created_at, last_login, onboarding')
      .or(`onboarding.is.null,onboarding.eq.in_progress`)
      .or(`last_login.is.null,last_login.lt.${thirtyDaysAgoISO}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inactive users:', error);
      throw error;
    }

    if (!users || users.length === 0) {
      console.log('No inactive users found.');
      return '';
    }

    // Convert to CSV format
    const headers = ['Email', 'First Name', 'Last Name', 'Created At', 'Last Login', 'Onboarding Status'];
    const csvRows = [headers.join(',')];

    for (const user of users) {
      const row = [
        user.email || '',
        user.first_name || '',
        user.last_name || '',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
        user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        user.onboarding || 'Not Started'
      ];
      // Escape commas and quotes in CSV
      csvRows.push(row.map(field => {
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      }).join(','));
    }

    const csvContent = csvRows.join('\n');
    console.log(`Exported ${users.length} inactive users.`);
    return csvContent;
  } catch (error) {
    console.error('Error exporting inactive users:', error);
    throw error;
  }
}

/**
 * Downloads inactive users as a CSV file
 * 
 * @param filename - Optional filename (default: 'inactive-users-YYYY-MM-DD.csv')
 */
export async function downloadInactiveUsersCSV(filename?: string): Promise<void> {
  try {
    const csvContent = await exportInactiveUsers();
    
    if (!csvContent) {
      console.warn('No data to download.');
      return;
    }

    // Generate filename with current date if not provided
    const dateStr = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `inactive-users-${dateStr}.csv`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log(`Downloaded ${finalFilename}`);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
}

/**
 * Logs inactive users to console in a readable format
 * Useful for quick review before exporting
 */
export async function logInactiveUsers(): Promise<void> {
  try {
    const csvContent = await exportInactiveUsers();
    
    if (!csvContent) {
      console.log('No inactive users found.');
      return;
    }

    const lines = csvContent.split('\n');
    console.log('\n=== INACTIVE USERS ===');
    console.log(lines.join('\n'));
    console.log(`\nTotal: ${lines.length - 1} users (excluding header)`);
    console.log('\nTo download as CSV, use: downloadInactiveUsersCSV()');
  } catch (error) {
    console.error('Error logging inactive users:', error);
  }
}

// Make functions available globally for browser console access
if (typeof window !== 'undefined') {
  (window as any).exportInactiveUsers = exportInactiveUsers;
  (window as any).downloadInactiveUsersCSV = downloadInactiveUsersCSV;
  (window as any).logInactiveUsers = logInactiveUsers;
  
  console.log('User export utilities loaded. Available functions:');
  console.log('  - logInactiveUsers() - View inactive users in console');
  console.log('  - exportInactiveUsers() - Get CSV string');
  console.log('  - downloadInactiveUsersCSV() - Download CSV file');
}








