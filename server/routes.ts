import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertProductSchema, insertOrderSchema, insertStockTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile/User routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfileById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const validated = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validated);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const branchId = req.query.branchId as string;
      const products = await storage.getProducts(branchId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const branchId = req.query.branchId as string;
      const orders = await storage.getOrders(branchId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Stock Transaction routes
  app.get("/api/stock-transactions", async (req, res) => {
    try {
      const branchId = req.query.branchId as string;
      const transactions = await storage.getStockTransactions(branchId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock transactions" });
    }
  });

  app.post("/api/stock-transactions", async (req, res) => {
    try {
      const validated = insertStockTransactionSchema.parse(req.body);
      const transaction = await storage.createStockTransaction(validated);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create stock transaction" });
    }
  });

  // Branch routes
  app.get("/api/branches", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const branches = await storage.getBranches(userId);
      res.json(branches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branches" });
    }
  });

  app.get("/api/branches/:id", async (req, res) => {
    try {
      const branch = await storage.getBranchById(req.params.id);
      if (!branch) {
        return res.status(404).json({ error: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branch" });
    }
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplierById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoiceById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  // Legacy user routes for backward compatibility
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // License and usage calculation route (replaces get-license-and-usage function)
  app.get("/api/license-usage/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.getProfileById(userId);
      
      if (!profile) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }

      const branches = await storage.getBranches(userId);
      const branchCount = branches.length;
      
      // Get user count (admin + staff for this admin's branches)
      const allProfiles = await storage.getProfiles();
      const userCount = allProfiles.filter(p => p.role === 'staff' || p.id === userId).length;
      
      // Mock plans data (would be from database in real implementation)
      const plans = [
        { id: 'free', name: 'Free', price: 0, limit: 1, extra_cost: 0 },
        { id: 'starter', name: 'Starter', price: 29, limit: 5, extra_cost: 5 },
        { id: 'pro', name: 'Pro', price: 79, limit: 25, extra_cost: 3 },
        { id: 'enterprise', name: 'Enterprise', price: 199, limit: 100, extra_cost: 2 }
      ];

      const selectedPlan = plans.find(p => p.id === profile.selected_plan) || plans[0];
      
      // Calculate pricing
      const basePrice = selectedPlan.price;
      const extraUsers = Math.max(0, userCount - selectedPlan.limit);
      const extraBranches = Math.max(0, branchCount - 1);
      const totalPrice = basePrice + (extraUsers * selectedPlan.extra_cost) + (extraBranches * 10); // $10 per extra branch

      res.json({
        profile: {
          selected_plan: profile.selected_plan,
          created_at: profile.created_at
        },
        branchCount,
        productCount: 0, // Mock for now
        userCount,
        plans,
        pricing: {
          basePrice,
          extraUsers,
          extraBranches,
          totalPrice
        }
      });
    } catch (error) {
      console.error("License usage error:", error);
      res.status(500).json({ error: "Failed to calculate license usage" });
    }
  });

  // Monthly invoice creation route
  app.post("/api/admin/monthly-invoices", async (req, res) => {
    try {
      // This would typically be an admin-only route with proper authentication
      const profiles = await storage.getProfiles();
      const paidProfiles = profiles.filter(p => p.selected_plan && p.selected_plan !== 'free');
      
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      let createdCount = 0;
      const plans = [
        { id: 'starter', price: 29 },
        { id: 'pro', price: 79 },
        { id: 'enterprise', price: 199 }
      ];

      for (const profile of paidProfiles) {
        if (!profile.selected_plan || profile.selected_plan === 'free') continue;
        
        const plan = plans.find(p => p.id === profile.selected_plan);
        if (!plan) continue;

        // Check if invoice already exists for this period
        const existingInvoices = await storage.getInvoices(profile.id);
        const existsForPeriod = existingInvoices.some(inv => inv.period === period);
        
        if (!existsForPeriod) {
          // Create invoice (would use proper invoice creation in real implementation)
          console.log(`Would create invoice for ${profile.email} - ${plan.price} EUR for period ${period}`);
          createdCount++;
        }
      }

      res.json({ success: true, createdCount });
    } catch (error) {
      console.error("Monthly invoice error:", error);
      res.status(500).json({ error: "Failed to create monthly invoices" });
    }
  });

  // Invoice reminder route
  app.post("/api/admin/invoice-reminders", async (req, res) => {
    try {
      // This would send email reminders for overdue invoices
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Mock invoice reminder logic
      console.log("Would send invoice reminders for overdue invoices");
      
      res.json({ success: true, remindersSent: 0 });
    } catch (error) {
      console.error("Invoice reminder error:", error);
      res.status(500).json({ error: "Failed to send invoice reminders" });
    }
  });

  // Block overdue users route
  app.post("/api/admin/block-overdue-users", async (req, res) => {
    try {
      // This would block users with overdue invoices
      console.log("Would block users with overdue invoices");
      
      res.json({ success: true, blockedCount: 0 });
    } catch (error) {
      console.error("Block overdue users error:", error);
      res.status(500).json({ error: "Failed to block overdue users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
