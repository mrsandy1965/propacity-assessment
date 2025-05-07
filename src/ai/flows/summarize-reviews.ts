'use server';
/**
 * @fileOverview Summarizes user reviews for a given product to identify key pain points, feature requests, and positive feedback.
 *
 * - summarizeReviews - A function that takes a list of user reviews and returns a summary of key themes and sentiments.
 * - SummarizeReviewsInput - The input type for the summarizeReviews function.
 * - SummarizeReviewsOutput - The return type for the summarizeReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {UserReview} from '@/services/data-fetcher';

const SummarizeReviewsInputSchema = z.object({
  reviews: z
    .array(z.object({
      id: z.string(),
      text: z.string(),
      sentiment: z.string(),
      source: z.string(),
      product: z.string(),
    }))
    .describe('An array of user reviews to summarize.'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key themes and sentiments from the user reviews.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  try {
    return await summarizeReviewsFlow(input);
  } catch (error) {
    console.error('Error in summarizeReviews:', error);
    throw new Error('Failed to summarize reviews. Please try again later.');
  }
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeReviewsInputSchema},
  output: {schema: SummarizeReviewsOutputSchema},
  prompt: `You are a product manager summarizing user reviews for a product.

  Here are the reviews:

  {{#each reviews}}
  Review (ID: {{this.id}}, Source: {{this.source}}, Sentiment: {{this.sentiment}}):
  {{this.text}}
  \n
  {{/each}}

  \n
  Based on these reviews, provide a concise summary of the key pain points, feature requests, and positive feedback. Focus on actionable insights for the product team.
  Please provide the summary.`,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeReviewsInputSchema,
    outputSchema: SummarizeReviewsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('No output received from the AI model');
      }
      return output;
    } catch (error) {
      console.error('Error in summarizeReviewsFlow:', error);
      throw new Error('Failed to generate summary. Please try again later.');
    }
  }
);
