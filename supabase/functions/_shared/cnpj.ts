/** Strip non-digit characters from a CNPJ string */
export function stripCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/**
 * Validate a 14-digit CNPJ using the official verification algorithm.
 * Rejects sequences of identical digits (00000..., 11111..., etc.)
 */
export function validateCnpj(cnpj: string): boolean {
  const digits = stripCnpj(cnpj);
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calcDigit = (nums: string, weights: number[]): number => {
    const sum = nums
      .split("")
      .reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(digits.slice(0, 12), w1);
  const d2 = calcDigit(digits.slice(0, 13), w2);

  return d1 === parseInt(digits[12]) && d2 === parseInt(digits[13]);
}
