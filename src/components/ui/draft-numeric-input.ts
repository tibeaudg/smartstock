import * as React from 'react';

interface UseDraftNumericInputOptions {
  pattern: RegExp;
  parse: (raw: string) => number;
  showEmptyWhenZero?: boolean;
}

export function useDraftNumericInput(
  value: number,
  { pattern, parse, showEmptyWhenZero = true }: UseDraftNumericInputOptions,
) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDraft(null);
    }
  }, [value]);

  const displayValue =
    draft !== null ? draft : showEmptyWhenZero && value === 0 ? '' : String(value);

  const handleChange = (raw: string): number | undefined => {
    if (raw !== '' && !pattern.test(raw)) {
      return undefined;
    }
    setDraft(raw);
    return parse(raw);
  };

  const handleBlur = () => setDraft(null);

  return { displayValue, handleChange, handleBlur, inputRef };
}
