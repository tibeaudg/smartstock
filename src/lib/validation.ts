import { z } from 'zod';

// User validation schemas
export const UserSignUpSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten'),
  firstName: z.string().min(1, 'Voornaam is verplicht').max(50, 'Voornaam is te lang'),
  lastName: z.string().min(1, 'Achternaam is verplicht').max(50, 'Achternaam is te lang'),
  role: z.enum(['admin', 'staff']).optional().default('admin')
});

export const UserSignInSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(1, 'Wachtwoord is verplicht')
});

export const PasswordResetSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres')
});

// Product validation schemas
export const ProductSchema = z.object({
  name: z.string().min(1, 'Productnaam is verplicht').max(100, 'Productnaam is te lang'),
  description: z.string().max(500, 'Beschrijving is te lang').optional(),
  sku: z.string().max(50, 'SKU is te lang').optional(),
  price: z.number().positive('Prijs moet positief zijn').optional(),
  cost_price: z.number().positive('Inkoopprijs moet positief zijn').optional(),
  min_stock: z.number().int().min(0, 'Minimum voorraad moet 0 of hoger zijn').optional(),
  max_stock: z.number().int().min(0, 'Maximum voorraad moet 0 of hoger zijn').optional(),
  category: z.string().max(50, 'Categorie is te lang').optional(),
  supplier_id: z.string().uuid('Ongeldige leverancier ID').optional(),
  branch_id: z.string().uuid('Ongeldige filiaal ID')
});

export const ProductUpdateSchema = ProductSchema.partial();

// Stock movement validation schemas
export const StockMovementSchema = z.object({
  product_id: z.string().uuid('Ongeldig product ID'),
  quantity: z.number().int('Aantal moet een geheel getal zijn').not(0, 'Aantal mag niet 0 zijn'),
  movement_type: z.enum(['in', 'out', 'adjustment'], {
    errorMap: () => ({ message: 'Ongeldig bewegingstype' })
  }),
  reason: z.string().min(1, 'Reden is verplicht').max(200, 'Reden is te lang'),
  reference: z.string().max(100, 'Referentie is te lang').optional(),
  branch_id: z.string().uuid('Ongeldige filiaal ID')
});

// Branch validation schemas
export const BranchSchema = z.object({
  name: z.string().min(1, 'Filiaalnaam is verplicht').max(100, 'Filiaalnaam is te lang'),
  address: z.string().max(200, 'Adres is te lang').optional(),
  phone: z.string().max(20, 'Telefoonnummer is te lang').optional(),
  email: z.string().email('Ongeldig e-mailadres').optional(),
  manager_id: z.string().uuid('Ongeldige manager ID').optional()
});

// Supplier validation schemas
export const SupplierSchema = z.object({
  name: z.string().min(1, 'Leveranciersnaam is verplicht').max(100, 'Leveranciersnaam is te lang'),
  contact_person: z.string().max(100, 'Contactpersoon is te lang').optional(),
  email: z.string().email('Ongeldig e-mailadres').optional(),
  phone: z.string().max(20, 'Telefoonnummer is te lang').optional(),
  address: z.string().max(200, 'Adres is te lang').optional(),
  website: z.string().url('Ongeldige website URL').optional()
});

// Profile update validation schemas
export const ProfileUpdateSchema = z.object({
  first_name: z.string().min(1, 'Voornaam is verplicht').max(50, 'Voornaam is te lang'),
  last_name: z.string().min(1, 'Achternaam is verplicht').max(50, 'Achternaam is te lang'),
  phone: z.string().max(20, 'Telefoonnummer is te lang').optional(),
  company_name: z.string().max(100, 'Bedrijfsnaam is te lang').optional()
});

// Password change validation schemas
export const PasswordChangeSchema = z.object({
  current_password: z.string().min(1, 'Huidig wachtwoord is verplicht'),
  new_password: z.string().min(8, 'Nieuw wachtwoord moet minimaal 8 karakters bevatten'),
  confirm_password: z.string().min(1, 'Bevestig wachtwoord is verplicht')
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirm_password"]
});

// Search and filter validation schemas
export const SearchSchema = z.object({
  query: z.string().max(100, 'Zoekopdracht is te lang').optional(),
  category: z.string().max(50, 'Categorie is te lang').optional(),
  supplier: z.string().uuid('Ongeldige leverancier ID').optional(),
  branch: z.string().uuid('Ongeldige filiaal ID').optional(),
  min_price: z.number().positive('Minimum prijs moet positief zijn').optional(),
  max_price: z.number().positive('Maximum prijs moet positief zijn').optional(),
  in_stock: z.boolean().optional()
});

// Export types
export type UserSignUpInput = z.infer<typeof UserSignUpSchema>;
export type UserSignInInput = z.infer<typeof UserSignInSchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
export type StockMovementInput = z.infer<typeof StockMovementSchema>;
export type BranchInput = z.infer<typeof BranchSchema>;
export type SupplierInput = z.infer<typeof SupplierSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
export type SearchInput = z.infer<typeof SearchSchema>; 