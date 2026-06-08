import * as React from 'react';
import { Input, type InputProps } from '@/components/ui/input';

const DECIMAL_INPUT_PATTERN = /^\d*\.?\d*$/;

function parseDecimalInput(raw: string): number {
  if (raw === '' || raw === '.') return 0;
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export interface DecimalInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const DecimalInput = React.forwardRef<HTMLInputElement, DecimalInputProps>(
  ({ value, onChange, onBlur, onFocus, ...props }, ref) => {
    const [draft, setDraft] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setDraft(null);
      }
    }, [value]);

    const displayValue =
      draft !== null ? draft : value === 0 ? '' : String(value);

    return (
      <Input
        {...props}
        ref={setRefs}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onFocus={(event) => {
          onFocus?.(event);
        }}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw !== '' && !DECIMAL_INPUT_PATTERN.test(raw)) {
            return;
          }
          setDraft(raw);
          onChange(parseDecimalInput(raw));
        }}
        onBlur={(event) => {
          setDraft(null);
          onBlur?.(event);
        }}
      />
    );
  },
);

DecimalInput.displayName = 'DecimalInput';
