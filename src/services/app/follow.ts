import { BaseService } from '../base/base';
import {
  ISubscription,
  ICreateSubscriptionRequest,
  ISubscriptionCheckResponse,
  IEnrichedSubscription
} from '@/types/app/IFollow.type';

class FollowService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Subscribe to a channel (follow a user)
   */
  async subscribe(data: ICreateSubscriptionRequest): Promise<ISubscription> {
    try {
      const response = await this.api.post<ISubscription>('/subscriptions', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unsubscribe from a channel (unfollow a user)
   */
  async unsubscribe(data: ICreateSubscriptionRequest): Promise<void> {
    try {
      await this.api.delete('/subscriptions', {data});
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all channels a user is subscribed to (follows)
   */
  async getSubscribedChannels(subscriberId: number): Promise<IEnrichedSubscription[]> {
    try {
      const response = await this.get<IEnrichedSubscription[]>(`/subscriptions/subscriber/${subscriberId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all subscribers of a channel (followers)
   */
  async getChannelSubscribers(subscribedToId: number): Promise<IEnrichedSubscription[]> {
    try {
      const response = await this.get<IEnrichedSubscription[]>(`/subscriptions/subscribed-to/${subscribedToId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a user is subscribed to a channel
   */
  async checkSubscription(subscriberId: number, subscribedToId: number): Promise<ISubscriptionCheckResponse> {
    try {
      // This endpoint is not directly exposed in the controller, so we'll get all subscriptions
      // and check if the channel is in the list
      const subscriptions = await this.getSubscribedChannels(subscriberId);
      const isSubscribed = subscriptions.some(sub => sub.subscribed_to_id === subscribedToId);
      return { isSubscribed };
    } catch (error) {
      // If we get a 404 error, it means the user is not subscribed
      return { isSubscribed: false };
    }
  }

  /**
   * Get subscription ID if it exists
   */
  async getSubscriptionId(subscriberId: number, subscribedToId: number): Promise<number | null> {
    try {
      const subscriptions = await this.getSubscribedChannels(subscriberId);
      const subscription = subscriptions.find(
        sub => sub.subscribed_to_id === subscribedToId
      );
      return subscription ? subscription.subscription_id : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get subscription count for a channel
   */
  async getSubscriberCount(channelId: number): Promise<number> {
    try {
      const subscribers = await this.getChannelSubscribers(channelId);
      return subscribers.length;
    } catch (error) {
      return 0;
    }
  }
}

export const followService = new FollowService();
