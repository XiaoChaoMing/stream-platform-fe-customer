import { IProfile, IUpdateProfileWithFilesRequest } from "@/types/app/IProfile.type";
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

  async updateProfile(userId: number, data: IUpdateProfileWithFilesRequest): Promise<IProfile> {
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Add text fields to the form data - username and email removed
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      
      // Add social_links as a stringified JSON
      if (data.social_links) {
        formData.append('social_links', data.social_links);
      }
      
      // Add files if they exist
      if (data.avatarFile) {
        formData.append('avatarFile', data.avatarFile);
      }
      
      if (data.bannerFile) {
        formData.append('bannerFile', data.bannerFile);
      }
      
      // Send multipart/form-data request
      const response = await this.api.put<IProfile>(
        `/profiles/update/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();

// Export individual methods for direct use
export const getUserProfile = profileService.getUserProfile.bind(profileService);
export const updateProfile = profileService.updateProfile.bind(profileService);

