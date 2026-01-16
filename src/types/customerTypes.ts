export interface CustomerAddress {
  attention?: string;
  name?: string;
  country?: string;
  street?: string;
  number?: string;
  box?: string;
  postal_code?: string;
  municipality?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  name: string; // Keep for backward compatibility
  email?: string;
  phone?: string;
  address?: string; // Keep for backward compatibility
  status?: 'Active' | 'Inactive';
  created_at: string;
  updated_at?: string;
  branch_id?: string;
  user_id?: string;
  
  // Company details
  company_number?: string;
  extra_id?: string;
  legal_name?: string; // Required field
  commercial_name?: string;
  iban?: string;
  bic?: string;
  payment_term?: number;
  extend_payment_term?: boolean;
  offer_validity_period?: number;
  payment_method?: string;
  standard_paid?: string;
  standard_currency?: string;
  vat_type?: string;
  general_ledger_account?: string;
  category?: string;
  
  // Customer details
  customer_number?: string;
  reference?: string;
  salutation?: string;
  director_first_name?: string;
  director_last_name?: string;
  rpr_number?: string;
  website?: string;
  mobile?: string;
  fax?: string;
  language?: string;
  high_risk?: boolean;
  vat_deductible?: boolean;
  small_enterprise?: boolean;
  vat_liable?: boolean;
  hide_iban_check?: boolean;
  
  // Addresses
  billing_address?: CustomerAddress | string; // Can be JSONB or string for backward compatibility
  delivery_address?: CustomerAddress | string;
  same_as_billing?: boolean;
  
  // Other
  comments?: string;
  contact_person?: string;
  municipality?: string;
  group?: string;
}

export type CustomerCreateData = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type CustomerUpdateData = Partial<CustomerCreateData>;