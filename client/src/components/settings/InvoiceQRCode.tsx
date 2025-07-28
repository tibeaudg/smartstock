import React from 'react';
import QRCode from 'react-qr-code';

interface InvoiceQRCodeProps {
  iban: string;
  amount: number;
  name: string;
  paymentReference: string;
}

// Genereer SEPA QR string volgens EPC QR standaard
function generateSepaQrString({ iban, amount, name, paymentReference }: InvoiceQRCodeProps) {
  // Bedrag in formaat EUR12.34
  const amountStr = `EUR${amount.toFixed(2)}`;
  // EPC QR format
  return [
    'BCD', // Service tag
    '001', // Version
    '1',   // Character set: 1 = UTF-8
    'SCT', // SEPA Credit Transfer
    name,
    iban.replace(/\s/g, ''),
    '', // BIC (optioneel)
    amountStr,
    '', // Purpose (optioneel)
    paymentReference,
    '', // Remittance info (optioneel)
    ''  // Extra (optioneel)
  ].join('\n');
}

export const InvoiceQRCode: React.FC<InvoiceQRCodeProps> = ({ iban, amount, name, paymentReference }) => {
  const qrString = generateSepaQrString({ iban, amount, name, paymentReference });
  return (
    <div className="flex flex-col items-center">
      <QRCode value={qrString} size={180} />
      <div className="text-xs text-gray-500 mt-2">Scan om direct te betalen</div>
    </div>
  );
}; 