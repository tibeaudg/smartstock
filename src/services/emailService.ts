interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName?: string;
  useTls: boolean;
}

interface EmailData {
  to: string;
  cc?: string;
  subject: string;
  body: string;
  purchaseOrderId: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

export class EmailService {
  private static instance: EmailService;
  private smtpConfig: SmtpConfig | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public setSmtpConfig(config: SmtpConfig): void {
    this.smtpConfig = config;
  }

  public getSmtpConfig(): SmtpConfig | null {
    return this.smtpConfig;
  }

  public async sendPurchaseOrderEmail(emailData: EmailData): Promise<boolean> {
    if (!this.smtpConfig) {
      throw new Error('SMTP configuration not set');
    }

    try {
      const response = await fetch('/api/send-purchase-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtpConfig: this.smtpConfig,
          emailData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error sending purchase order email:', error);
      throw error;
    }
  }

  public async testSmtpConnection(config: SmtpConfig): Promise<boolean> {
    try {
      const response = await fetch('/api/send-purchase-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ smtpConfig: config, action: 'test' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      return false;
    }
  }

  public generatePurchaseOrderTemplate(
    poNumber: string,
    vendorName: string,
    totalAmount: number,
    items: Array<{
      name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>,
    deliveryDate?: string,
    terms?: string
  ): EmailTemplate {
    const subject = `Purchase Order ${poNumber} - ${vendorName}`;
    
    const itemsTable = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.unit_price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.total_price.toFixed(2)}</td>
      </tr>
    `).join('');

    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Order ${poNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; color: #2c5aa0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Purchase Order ${poNumber}</h1>
          <p><strong>Vendor:</strong> ${vendorName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${deliveryDate ? `<p><strong>Expected Delivery:</strong> ${new Date(deliveryDate).toLocaleDateString()}</p>` : ''}
        </div>

        <div class="content">
          <p>Dear ${vendorName},</p>
          <p>Please find below our purchase order details:</p>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTable}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total Amount:</td>
                <td class="total">$${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          ${terms ? `<p><strong>Terms:</strong> ${terms}</p>` : ''}
        </div>

        <div class="footer">
          <p>Please confirm receipt of this purchase order and provide an estimated delivery date.</p>
          <p>Thank you for your business!</p>
          <p>Best regards,<br>Your Company</p>
        </div>
      </body>
      </html>
    `;

    return { subject, body };
  }

  public generateSimpleTemplate(
    poNumber: string,
    vendorName: string,
    totalAmount: number,
    items: Array<{
      name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>
  ): EmailTemplate {
    const subject = `Purchase Order ${poNumber}`;
    
    const itemsList = items.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - $${item.total_price.toFixed(2)}`
    ).join('\n');

    const body = `Dear ${vendorName},

Please find our purchase order details:

Purchase Order: ${poNumber}
Date: ${new Date().toLocaleDateString()}

Items:
${itemsList}

Total Amount: $${totalAmount.toFixed(2)}

Please confirm receipt and provide delivery date.

Thank you for your business!

Best regards,
Your Company`;

    return { subject, body };
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
