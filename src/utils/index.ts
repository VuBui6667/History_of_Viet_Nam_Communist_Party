type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassValue[];
interface ClassDictionary { [key: string]: any }

/**
 * Concatenate Tailwind class names.
 * Supports strings, numbers, arrays and objects for conditional classes.
 *
 * Examples:
 * cn('p-4', isActive && 'bg-blue-500', ['text-lg', condition ? 'font-bold' : null], { 'hidden': !visible })
 */
export function cn(...args: ClassValue[]): string {
  const out: string[] = [];

  const push = (val: ClassValue) => {
    if (!val && val !== 0) return; // skip null/undefined/false/'' but keep 0
    const t = typeof val;
    if (t === 'string' || t === 'number') {
      const s = String(val).trim();
      if (s) out.push(s);
    } else if (Array.isArray(val)) {
      for (const v of val) push(v);
    } else if (t === 'object') {
      for (const [k, v] of Object.entries(val as ClassDictionary)) {
        if (v) out.push(k);
      }
    }
  };

  for (const a of args) push(a);
  return out.join(' ');
}

export default cn;