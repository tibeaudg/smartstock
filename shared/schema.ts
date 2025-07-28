import { pgTable, text, serial, integer, boolean, timestamp, numeric, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff']);
export const stockStatusEnum = pgEnum('stock_status', ['in_stock', 'low_stock', 'out_of_stock']);
export const transactionTypeEnum = pgEnum('transaction_type', ['in', 'out', 'adjustment']);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  role: userRoleEnum("role").notNull().default('staff'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  selected_plan: text("selected_plan"),
  blocked: boolean("blocked").default(false),
});

export const branches = pgTable("branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address"),
  email: text("email"),
  phone: text("phone"),
  is_active: boolean("is_active").default(true),
  is_main: boolean("is_main").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contact_person: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category_id: uuid("category_id"),
  category_name: text("category_name"),
  supplier_id: uuid("supplier_id").references(() => suppliers.id),
  supplier_name: text("supplier_name"),
  branch_id: uuid("branch_id").references(() => branches.id),
  quantity_in_stock: integer("quantity_in_stock").default(0),
  minimum_stock_level: integer("minimum_stock_level").default(0),
  unit_price: numeric("unit_price", { precision: 10, scale: 2 }).default("0"),
  purchase_price: numeric("purchase_price", { precision: 10, scale: 2 }).default("0"),
  sale_price: numeric("sale_price", { precision: 10, scale: 2 }).default("0"),
  status: stockStatusEnum("status"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_number: text("order_number").notNull(),
  supplier_id: uuid("supplier_id").references(() => suppliers.id),
  branch_id: uuid("branch_id").references(() => branches.id),
  status: text("status").default('pending'),
  order_date: timestamp("order_date").defaultNow(),
  expected_delivery: timestamp("expected_delivery"),
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").references(() => orders.id),
  product_id: uuid("product_id").references(() => products.id),
  branch_id: uuid("branch_id").references(() => branches.id),
  quantity: integer("quantity").notNull(),
  unit_price: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  total_price: numeric("total_price", { precision: 10, scale: 2 }),
});

export const stockTransactions = pgTable("stock_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id),
  product_name: text("product_name"),
  branch_id: uuid("branch_id").references(() => branches.id),
  transaction_type: transactionTypeEnum("transaction_type").notNull(),
  quantity: integer("quantity").notNull(),
  unit_price: numeric("unit_price", { precision: 10, scale: 2 }),
  total_value: numeric("total_value", { precision: 10, scale: 2 }),
  reference_number: text("reference_number"),
  notes: text("notes"),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const branchUsers = pgTable("branch_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  branch_id: uuid("branch_id").references(() => branches.id),
  user_id: uuid("user_id").references(() => profiles.id),
  role: text("role").default('staff'),
  granted_by: uuid("granted_by").references(() => profiles.id),
  granted_at: timestamp("granted_at").defaultNow(),
});

export const licenses = pgTable("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  admin_user_id: uuid("admin_user_id").references(() => profiles.id),
  license_type: text("license_type").default('free'),
  max_users: integer("max_users").default(1),
  max_branches: integer("max_branches").default(1),
  monthly_price: numeric("monthly_price", { precision: 10, scale: 2 }).default("0"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  limit: integer("limit").notNull(),
  extra_cost: numeric("extra_cost", { precision: 10, scale: 2 }).default("0"),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => profiles.id).notNull(),
  period: text("period").notNull(), // YYYY-MM format
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default('open'), // open, paid
  invoice_date: timestamp("invoice_date").notNull(),
  due_date: timestamp("due_date").notNull(),
  paid_at: timestamp("paid_at"),
  payment_reference: text("payment_reference"),
  reminder_sent_at: timestamp("reminder_sent_at"),
  reminder_count: integer("reminder_count").default(0),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  table_name: text("table_name").notNull(),
  record_id: uuid("record_id"),
  action: text("action").notNull(), // create, update, delete
  old_values: text("old_values"), // JSON string
  new_values: text("new_values"), // JSON string
  user_id: uuid("user_id").references(() => profiles.id),
  branch_id: uuid("branch_id").references(() => branches.id),
  created_at: timestamp("created_at").defaultNow(),
});

// Create insert schemas for validation
export const insertProfileSchema = createInsertSchema(profiles).pick({
  email: true,
  first_name: true,
  last_name: true,
  role: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  category_name: true,
  supplier_name: true,
  quantity_in_stock: true,
  minimum_stock_level: true,
  unit_price: true,
  purchase_price: true,
  sale_price: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  order_number: true,
  supplier_id: true,
  branch_id: true,
  expected_delivery: true,
  total_amount: true,
});

export const insertStockTransactionSchema = createInsertSchema(stockTransactions).pick({
  product_id: true,
  transaction_type: true,
  quantity: true,
  unit_price: true,
  reference_number: true,
  notes: true,
});

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type StockTransaction = typeof stockTransactions.$inferSelect;
export type InsertStockTransaction = z.infer<typeof insertStockTransactionSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;

// Legacy exports for compatibility during migration
export const users = profiles; // Alias for backward compatibility
export type User = Profile;
export type InsertUser = InsertProfile;
export const insertUserSchema = insertProfileSchema;