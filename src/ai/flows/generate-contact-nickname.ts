'use server';

/**
 * @fileOverview Generates a memorable nickname for a contact based on their name and phone number.
 *
 * - generateContactNickname - A function that generates the nickname.
 * - GenerateContactNicknameInput - The input type for the generateContactNickname function.
 * - GenerateContactNicknameOutput - The return type for the generateContactNickname function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContactNicknameInputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
  phoneNumber: z.string().describe('The phone number of the contact.'),
});
export type GenerateContactNicknameInput = z.infer<typeof GenerateContactNicknameInputSchema>;

const GenerateContactNicknameOutputSchema = z.object({
  nickname: z.string().describe('A memorable nickname for the contact.'),
});
export type GenerateContactNicknameOutput = z.infer<typeof GenerateContactNicknameOutputSchema>;

export async function generateContactNickname(input: GenerateContactNicknameInput): Promise<GenerateContactNicknameOutput> {
  return generateContactNicknameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContactNicknamePrompt',
  input: {schema: GenerateContactNicknameInputSchema},
  output: {schema: GenerateContactNicknameOutputSchema},
  prompt: `You are a creative nickname generator. Generate a fun and memorable nickname for a contact based on their name and phone number.

Name: {{{name}}}
Phone Number: {{{phoneNumber}}}

Nickname:`,
});

const generateContactNicknameFlow = ai.defineFlow(
  {
    name: 'generateContactNicknameFlow',
    inputSchema: GenerateContactNicknameInputSchema,
    outputSchema: GenerateContactNicknameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
