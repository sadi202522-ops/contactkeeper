'use server';

/**
 * @fileOverview Generates an abstract profile photo for a contact.
 *
 * - generateContactPhoto - A function that generates the photo.
 * - GenerateContactPhotoInput - The input type for the generateContactPhoto function.
 * - GenerateContactPhotoOutput - The return type for the generateContactPhoto function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateContactPhotoInputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
});
export type GenerateContactPhotoInput = z.infer<typeof GenerateContactPhotoInputSchema>;

const GenerateContactPhotoOutputSchema = z.object({
  photoUrl: z.string().describe('A data URI of the generated abstract avatar.'),
});
export type GenerateContactPhotoOutput = z.infer<typeof GenerateContactPhotoOutputSchema>;

export async function generateContactPhoto(
  input: GenerateContactPhotoInput
): Promise<GenerateContactPhotoOutput> {
  return generateContactPhotoFlow(input);
}

const generateContactPhotoFlow = ai.defineFlow(
  {
    name: 'generateContactPhotoFlow',
    inputSchema: GenerateContactPhotoInputSchema,
    outputSchema: GenerateContactPhotoOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a visually appealing, abstract, and minimalist avatar representing a person named "${input.name}". The design should be simple, modern, and suitable for a contact profile picture. Avoid literal representations. Focus on shapes and colors.`,
      config: {
        aspectRatio: '1:1',
      }
    });

    return { photoUrl: media.url };
  }
);
