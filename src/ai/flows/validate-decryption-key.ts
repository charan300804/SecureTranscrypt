'use server';

/**
 * @fileOverview Validates the decryption key provided by the Receiver.
 *
 * - validateDecryptionKey - A function that validates the decryption key.
 * - ValidateDecryptionKeyInput - The input type for the validateDecryptionKey function.
 * - ValidateDecryptionKeyOutput - The return type for the validateDecryptionKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ValidateDecryptionKeyInputSchema = z.object({
  key: z.string().describe('The decryption key to validate.'),
});
export type ValidateDecryptionKeyInput = z.infer<typeof ValidateDecryptionKeyInputSchema>;

const ValidateDecryptionKeyOutputSchema = z.object({
  isValid: z.boolean().describe('Indicates whether the decryption key is valid.'),
});
export type ValidateDecryptionKeyOutput = z.infer<typeof ValidateDecryptionKeyOutputSchema>;

export async function validateDecryptionKey(input: ValidateDecryptionKeyInput): Promise<ValidateDecryptionKeyOutput> {
  return validateDecryptionKeyFlow(input);
}

const validateDecryptionKeyPrompt = ai.definePrompt({
  name: 'validateDecryptionKeyPrompt',
  input: {schema: ValidateDecryptionKeyInputSchema},
  output: {schema: ValidateDecryptionKeyOutputSchema},
  prompt: `You are a security expert. The user will provide you with a key. Respond with whether or not the key is valid. Be as accurate as possible. Output whether or not the key is valid in the isValid field. The key is: {{{key}}}`,
});

const validateDecryptionKeyFlow = ai.defineFlow(
  {
    name: 'validateDecryptionKeyFlow',
    inputSchema: ValidateDecryptionKeyInputSchema,
    outputSchema: ValidateDecryptionKeyOutputSchema,
  },
  async input => {
    const {output} = await validateDecryptionKeyPrompt(input);
    return output!;
  }
);
