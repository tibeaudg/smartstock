export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  branch_id?: string;
}

export type SupplierCreateData = Omit<Supplier, 'id' | 'created_at'>;
export type SupplierUpdateData = Partial<SupplierCreateData>;