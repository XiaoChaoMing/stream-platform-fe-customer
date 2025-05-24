/**
 * Interfaces for the subscription (follow) functionality
 */

// Base subscription interface
export interface ISubscription {
  id: number;
  subscriber_id: number;
  subscribed_to_id: number;
  created_at: string;
  updated_at: string;
}

// Request DTO for creating a subscription
export interface ICreateSubscriptionRequest {
  subscriber_id: number;
  subscribed_to_id: number;
}

// Request DTO for deleting a subscription
export interface IDeleteSubscriptionRequest {
  subscription_id: number;
  subscriber_id: number;
}

// Response when checking if a user is subscribed to a channel
export interface ISubscriptionCheckResponse {
  isSubscribed: boolean;
}

// Stats about subscriptions for a channel
export interface ISubscriptionStats {
  subscriberCount: number;
  isSubscribed: boolean;
}

// Filter for fetching subscriptions
export interface ISubscriptionFilter {
  page?: number;
  limit?: number;
}

// Enriched subscription with user profile data
export interface IEnrichedSubscription {
  subscription_id: number;
  subscriber_id: number;
  subscribed_to_id: number;
  created_at: string;
  subscribedTo: {
    username: string;
    avatar: string;
    profile: {
      profile_id: number;
      user_id: number;
      name: string;
      description: string;
      banner_url: string | null;
      social_links: any | null;
      created_at: string;
      updated_at: string;
    }
  }
} 