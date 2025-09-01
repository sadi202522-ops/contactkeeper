'use server';

/**
 * @fileOverview Generates a short bio for a contact.
 *
 * - generateContactBio - A function that generates the bio.
 * - GenerateContactBioInput - The input type for the generateContactBio function.
 * - GenerateContactBioOutput - The return type for the generateContactBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContactBioInputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
  nickname: z.string().describe('The nickname of the contact.'),
});
export type GenerateContactBioInput = z.infer<typeof GenerateContactBioInputSchema>;

const GenerateContactBioOutputSchema = z.object({
  bio: z.string().describe('A short, friendly bio for the contact.'),
});
export type GenerateContactBioOutput = z.infer<typeof GenerateContactBioOutputSchema>;

export async function generateContactBio(input: GenerateContactBioInput): Promise<GenerateContactBioOutput> {
  return generateContactBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContactBioPrompt',
  input: {schema: GenerateContactBioInputSchema},
  output: {schema: GenerateContactBioOutputSchema},
  prompt: `You are an expert copywriter. Generate a short, friendly, and engaging bio for a contact.

Name: {{{name}}}
Nickname: {{{nickname}}}

Bio:`,
});

const generateContactBioFlow = ai.defineFlow(
  {
    name: 'generateContactBioFlow',
    inputSchema: GenerateContactBioInputSchema,
    outputSchema: GenerateContactBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
