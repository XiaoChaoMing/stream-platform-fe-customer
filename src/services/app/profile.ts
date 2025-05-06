import { IProfile, IUpdateProfileRequest } from "@/types/app/IProfile.type";
import { BaseService } from "../base/base";


class ProfileService extends BaseService {
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  async getUserProfile(userId:number): Promise<IProfile> {
    try {
      const response = await this.get<IProfile>(`/profile/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileId: string | number, profileData: IUpdateProfileRequest): Promise<IProfile> {
    try {
      const response = await this.put<IProfile>(`/profiles/update/${profileId}`, profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();

// Export individual methods for direct use
export const getUserProfile = profileService.getUserProfile.bind(profileService);
export const updateProfile = profileService.updateProfile.bind(profileService);
