import { 
  profiles, products, orders, stockTransactions, branches, suppliers, invoices,
  type Profile, type InsertProfile,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type StockTransaction, type InsertStockTransaction,
  type Branch, type Supplier, type Invoice,
  type User, type InsertUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Profile operations (primary user management)
  getProfiles(): Promise<Profile[]>;
  getProfileById(id: string): Promise<Profile | null>;
  getProfileByEmail(email: string): Promise<Profile | null>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile>;
  deleteProfile(id: string): Promise<void>;

  // Product operations
  getProducts(branchId?: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Order operations
  getOrders(branchId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;

  // Stock Transaction operations
  getStockTransactions(branchId?: string): Promise<StockTransaction[]>;
  createStockTransaction(transaction: InsertStockTransaction): Promise<StockTransaction>;

  // Branch operations
  getBranches(userId?: string): Promise<Branch[]>;
  getBranchById(id: string): Promise<Branch | null>;
  
  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: string): Promise<Supplier | null>;

  // Invoice operations
  getInvoices(userId?: string): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;

  // Legacy user operations for backward compatibility
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private stockTransactions: Map<string, StockTransaction>;
  private branches: Map<string, Branch>;
  private suppliers: Map<string, Supplier>;
  private invoices: Map<string, Invoice>;

  constructor() {
    this.profiles = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.stockTransactions = new Map();
    this.branches = new Map();
    this.suppliers = new Map();
    this.invoices = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample profiles
    const adminProfile: Profile = {
      id: randomUUID(),
      email: "admin@stockflow.app",
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
      selected_plan: "pro",
      blocked: false,
    };
    this.profiles.set(adminProfile.id, adminProfile);

    // Add sample branch
    const mainBranch: Branch = {
      id: randomUUID(),
      name: "Main Branch",
      address: "123 Main St",
      email: "main@stockflow.app",
      phone: "+1-555-0123",
      is_active: true,
      is_main: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.branches.set(mainBranch.id, mainBranch);

    // Add sample supplier
    const supplier: Supplier = {
      id: randomUUID(),
      name: "Sample Supplier",
      contact_person: "John Doe",
      email: "supplier@example.com",
      phone: "+1-555-0456",
      address: "456 Supplier Ave",
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.suppliers.set(supplier.id, supplier);

    // Add sample products
    const product1: Product = {
      id: randomUUID(),
      name: "Sample Product 1",
      description: "This is a sample product",
      category_id: null,
      category_name: "Electronics",
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      branch_id: mainBranch.id,
      quantity_in_stock: 50,
      minimum_stock_level: 10,
      unit_price: "25.99",
      purchase_price: "15.00",
      sale_price: "29.99",
      status: "in_stock",
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.products.set(product1.id, product1);
  }

  // Profile operations
  async getProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfileById(id: string): Promise<Profile | null> {
    return this.profiles.get(id) || null;
  }

  async getProfileByEmail(email: string): Promise<Profile | null> {
    return Array.from(this.profiles.values()).find(p => p.email === email) || null;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      created_at: new Date(),
      updated_at: new Date(),
      selected_plan: null,
      blocked: false,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, update: Partial<Profile>): Promise<Profile> {
    const existing = this.profiles.get(id);
    if (!existing) throw new Error("Profile not found");
    
    const updated: Profile = {
      ...existing,
      ...update,
      updated_at: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<void> {
    this.profiles.delete(id);
  }

  // Product operations
  async getProducts(branchId?: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return branchId ? products.filter(p => p.branch_id === branchId) : products;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      category_id: null,
      supplier_id: null,
      branch_id: null,
      status: "in_stock",
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, update: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    
    const updated: Product = {
      ...existing,
      ...update,
      updated_at: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Order operations
  async getOrders(branchId?: string): Promise<Order[]> {
    const orders = Array.from(this.orders.values());
    return branchId ? orders.filter(o => o.branch_id === branchId) : orders;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      order_date: new Date(),
      created_by: null,
      created_at: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, update: Partial<Order>): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error("Order not found");
    
    const updated: Order = { ...existing, ...update };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: string): Promise<void> {
    this.orders.delete(id);
  }

  // Stock Transaction operations
  async getStockTransactions(branchId?: string): Promise<StockTransaction[]> {
    const transactions = Array.from(this.stockTransactions.values());
    return branchId ? transactions.filter(t => t.branch_id === branchId) : transactions;
  }

  async createStockTransaction(insertTransaction: InsertStockTransaction): Promise<StockTransaction> {
    const id = randomUUID();
    const transaction: StockTransaction = {
      ...insertTransaction,
      id,
      product_name: null,
      branch_id: null,
      total_value: null,
      created_by: null,
      created_at: new Date(),
    };
    this.stockTransactions.set(id, transaction);
    return transaction;
  }

  // Branch operations
  async getBranches(userId?: string): Promise<Branch[]> {
    return Array.from(this.branches.values());
  }

  async getBranchById(id: string): Promise<Branch | null> {
    return this.branches.get(id) || null;
  }

  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    return this.suppliers.get(id) || null;
  }

  // Invoice operations
  async getInvoices(userId?: string): Promise<Invoice[]> {
    const invoices = Array.from(this.invoices.values());
    return userId ? invoices.filter(i => i.user_id === userId) : invoices;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoices.get(id) || null;
  }

  // Legacy user operations (map to profiles)
  async getUsers(): Promise<User[]> {
    return this.getProfiles();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.getProfileById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.getProfileByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.createProfile(user);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.updateProfile(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.deleteProfile(id);
  }
}

export const storage = new MemStorage();

// Initialize demo data
const initializeDemoData = async () => {
  try {
    // Add demo admin profile
    const adminProfile = await storage.createProfile({
      email: 'admin@stockflow.demo',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
    });

    // Add demo staff profile
    const staffProfile = await storage.createProfile({
      email: 'staff@stockflow.demo',
      first_name: 'Staff',
      last_name: 'Member',
      role: 'staff',
    });

    // Add demo branch
    const branch = await storage.createBranch({
      name: 'Main Branch',
      address: '123 Main Street',
      phone: '+1-555-0123',
      email: 'main@stockflow.demo',
      user_id: adminProfile.id,
      is_main: true,
      is_active: true,
    });

    // Add demo category
    const category = await storage.createCategory({
      name: 'Electronics',
      description: 'Electronic devices and accessories',
    });

    // Add demo supplier
    const supplier = await storage.createSupplier({
      name: 'Demo Supplier Inc.',
      email: 'supplier@demo.com',
      phone: '+1-555-0456',
      address: '456 Supplier Avenue',
    });

    // Add demo products
    const product1 = await storage.createProduct({
      name: 'Laptop Computer',
      description: 'High-performance laptop for business use',
      quantity_in_stock: 15,
      minimum_stock_level: 5,
      unit_price: 899.99,
      purchase_price: 699.99,
      sale_price: 899.99,
      branch_id: branch.id,
      category_id: category.id,
      supplier_id: supplier.id,
      user_id: adminProfile.id,
    });

    const product2 = await storage.createProduct({
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with USB receiver',
      quantity_in_stock: 50,
      minimum_stock_level: 10,
      unit_price: 29.99,
      purchase_price: 19.99,
      sale_price: 29.99,
      branch_id: branch.id,
      category_id: category.id,
      supplier_id: supplier.id,
      user_id: adminProfile.id,
    });

    // Add demo stock transactions
    await storage.createStockTransaction({
      product_id: product1.id,
      product_name: product1.name,
      transaction_type: 'incoming',
      quantity: 15,
      unit_price: 699.99,
      reference_number: 'INITIAL_STOCK_001',
      notes: 'Initial stock for laptop computers',
      created_by: adminProfile.id,
      branch_id: branch.id,
    });

    await storage.createStockTransaction({
      product_id: product2.id,
      product_name: product2.name,
      transaction_type: 'incoming',
      quantity: 50,
      unit_price: 19.99,
      reference_number: 'INITIAL_STOCK_002',
      notes: 'Initial stock for wireless mice',
      created_by: adminProfile.id,
      branch_id: branch.id,
    });

    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};

// Initialize demo data on startup
initializeDemoData();
