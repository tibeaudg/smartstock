import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types/customerTypes';
import { Plus } from 'lucide-react';

interface CustomerAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCustomerSelect?: (customer: Customer | null) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const CustomerAutocomplete: React.FC<CustomerAutocompleteProps> = ({
  value,
  onChange,
  onCustomerSelect,
  onCreateNew,
  placeholder = "Enter customer name",
  label = "Customer Name",
  required = false,
  disabled = false
}) => {
  const { data: customers = [], isLoading } = useCustomers();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter customers based on input value
  const filtered = useMemo(() => {
    if (!value || !customers.length) return [];
    
    const query = value.toLowerCase().trim();
    return customers.filter(customer => {
      const name = (customer.legal_name || customer.commercial_name || customer.name || '').toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const companyNumber = (customer.company_number || '').toLowerCase();
      
      return name.includes(query) || 
             email.includes(query) || 
             companyNumber.includes(query);
    });
  }, [value, customers]);

  useEffect(() => {
    setFilteredCustomers(filtered);
    setIsOpen(filtered.length > 0 && !disabled && value.length > 0);
  }, [filtered, disabled, value.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (onCustomerSelect) {
      onCustomerSelect(null);
    }
  };

  const handleCustomerClick = (customer: Customer) => {
    const displayName = customer.legal_name || customer.commercial_name || customer.name || '';
    onChange(displayName);
    setIsOpen(false);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  const handleInputFocus = () => {
    if (!disabled && filteredCustomers.length > 0 && value.length > 0) {
      setIsOpen(true);
    }
  };

  const getCustomerDisplayName = (customer: Customer): string => {
    return customer.legal_name || customer.commercial_name || customer.name || '';
  };

  const getCustomerSecondaryInfo = (customer: Customer): string => {
    const parts: string[] = [];
    if (customer.email) parts.push(customer.email);
    if (customer.company_number) parts.push(`#${customer.company_number}`);
    return parts.join(' • ');
  };

  const showCreateButton = value.length > 0 && filteredCustomers.length === 0 && !isLoading && onCreateNew;

  return (
    <div className="relative">
      <Label htmlFor="customerAutocomplete">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative mt-1">
        <Input
          ref={inputRef}
          id="customerAutocomplete"
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled || isLoading}
          className="pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>
      
      {/* Dropdown with suggestions */}
      {isOpen && filteredCustomers.length > 0 && !disabled && (
        <Card
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border shadow-lg"
        >
          <div className="py-1">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="font-medium text-sm text-gray-900">
                  {getCustomerDisplayName(customer)}
                </div>
                {getCustomerSecondaryInfo(customer) && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {getCustomerSecondaryInfo(customer)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create New Customer Button */}
      {showCreateButton && (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreateNew}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Customer
          </Button>
        </div>
      )}
    </div>
  );
};

