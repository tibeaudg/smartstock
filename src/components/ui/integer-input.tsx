import * as React from 'react';
import { Input, type InputProps } from '@/components/ui/input';
import { useDraftNumericInput } from '@/components/ui/draft-numeric-input';

const INTEGER_INPUT_PATTERN = /^\d*$/;

function parseIntegerInput(raw: string): number {
  if (raw === '') return 0;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export interface IntegerInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const IntegerInput = React.forwardRef<HTMLInputElement, IntegerInputProps>(
  ({ value, onChange, onBlur, onFocus, ...props }, ref) => {
    const { displayValue, handleChange, handleBlur, inputRef } = useDraftNumericInput(value, {
      pattern: INTEGER_INPUT_PATTERN,
      parse: parseIntegerInput,
    });

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, inputRef],
    );

    return (
      <Input
        {...props}
        ref={setRefs}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onFocus={(event) => {
          onFocus?.(event);
        }}
        onChange={(event) => {
          const parsed = handleChange(event.target.value);
          if (parsed !== undefined) {
            onChange(parsed);
          }
        }}
        onBlur={(event) => {
          handleBlur();
          onBlur?.(event);
        }}
      />
    );
  },
);

IntegerInput.displayName = 'IntegerInput';
