/**
 * Represents a user review with associated content and metadata.
 */
export interface UserReview {
  /**
   * The unique identifier for the review.
   */
  id: string;
  /**
   * The text content of the review.
   */
  text: string;
  /**
   * The sentiment associated with the review (e.g., positive, negative, neutral).
   */
  sentiment: string;
  /**
   * The source of the review (e.g., Twitter, Google Play).
   */
  source: string;
  /**
   * The product or app being reviewed.
   */
  product: string;
}

export const MOCK_DATA_SOURCES = [
  { value: "google_play_awesomeapp", label: "Google Play - AwesomeApp" },
  { value: "twitter_genericproduct", label: "Twitter - GenericProduct" },
  { value: "app_store_anotherapp", label: "App Store - AnotherApp" },
];

// Mock data simulating different sources and products
const mockReviewsData: Record<string, UserReview[]> = {
  google_play_awesomeapp: [
    {
      id: 'gp_aa_1',
      text: 'Great product! Highly recommended. The new UI is fantastic and much more intuitive.',
      sentiment: 'positive',
      source: 'Google Play',
      product: 'AwesomeApp',
    },
    {
      id: 'gp_aa_2',
      text: 'The app crashes frequently after the last update, especially when I try to upload a photo. Needs improvement.',
      sentiment: 'negative',
      source: 'Google Play',
      product: 'AwesomeApp',
    },
    {
      id: 'gp_aa_3',
      text: 'It\'s an okay app. Does what it says, but the design feels a bit outdated. Could use a refresh.',
      sentiment: 'neutral',
      source: 'Google Play',
      product: 'AwesomeApp',
    },
    {
      id: 'gp_aa_4',
      text: 'I love the customer support! They are very responsive and helpful. Solved my issue in minutes.',
      sentiment: 'positive',
      source: 'Google Play',
      product: 'AwesomeApp',
    },
    {
      id: 'gp_aa_5',
      text: 'Too many ads! It\'s very distracting and makes the user experience poor. I would pay for an ad-free version.',
      sentiment: 'negative',
      source: 'Google Play',
      product: 'AwesomeApp',
    },
  ],
  twitter_genericproduct: [
    {
      id: 'tw_gp_1',
      text: "@GenericProduct your new feature is a game changer! #innovation #awesome",
      sentiment: 'positive',
      source: 'Twitter',
      product: 'GenericProduct',
    },
    {
      id: 'tw_gp_2',
      text: "Seriously @GenericProduct, why is it so slow? Fix your performance issues! #fail #slowapp",
      sentiment: 'negative',
      source: 'Twitter',
      product: 'GenericProduct',
    },
    {
      id: 'tw_gp_3',
      text: "Just tried @GenericProduct. It's... fine. Nothing special but gets the job done. #meh",
      sentiment: 'neutral',
      source: 'Twitter',
      product: 'GenericProduct',
    },
     {
      id: 'tw_gp_4',
      text: "I wish @GenericProduct had a dark mode. My eyes would thank you! #featurerequest",
      sentiment: 'neutral',
      source: 'Twitter',
      product: 'GenericProduct',
    },
  ],
  app_store_anotherapp: [
    {
      id: 'as_an_1',
      text: 'AnotherApp is incredible! Smooth performance and beautiful design. Worth every penny.',
      sentiment: 'positive',
      source: 'App Store',
      product: 'AnotherApp',
    },
    {
      id: 'as_an_2',
      text: 'Subscription is too expensive for what it offers. Many free alternatives are better.',
      sentiment: 'negative',
      source: 'App Store',
      product: 'AnotherApp',
    },
    {
      id: 'as_an_3',
      text: 'This app has potential but there are still some bugs with the notification system. Sometimes they don\'t appear.',
      sentiment: 'negative',
      source: 'App Store',
      product: 'AnotherApp',
    },
    {
      id: 'as_an_4',
      text: 'I use AnotherApp daily. It has simplified my workflow significantly. The integration with other services is seamless.',
      sentiment: 'positive',
      source: 'App Store',
      product: 'AnotherApp',
    },
  ],
};


/**
 * Asynchronously fetches user reviews for a given product from a specified source.
 * @param source The source identifier (e.g., "google_play_awesomeapp").
 * @param product The product for which to retrieve reviews (currently used for context, actual data is keyed by source).
 * @returns A promise that resolves to an array of UserReview objects.
 */
export async function fetchUserReviews(source: string, product: string): Promise<UserReview[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 750));

  // Return mock data based on the source
  if (mockReviewsData[source]) {
    // Filter by product just in case, though our mock data is already structured by source which implies product
    return mockReviewsData[source].filter(review => review.product === product || product === "GenericProduct");
  }
  
  console.warn(`No mock data found for source: ${source} and product: ${product}. Returning empty array.`);
  return [];
}
