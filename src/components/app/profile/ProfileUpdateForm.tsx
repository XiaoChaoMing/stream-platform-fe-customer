import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileQuery } from '@/hooks/useProfileQuery';
import { IUpdateProfileRequest } from '@/types/app/IProfile.type';
import { useStore } from '@/store/useStore';

interface ProfileUpdateFormProps {
  userId: number;
  profileId: string | number;
  onSuccess?: () => void; // Optional callback when update is successful
}

export function ProfileUpdateForm({ userId, profileId, onSuccess }: ProfileUpdateFormProps) {
  const { profile, updateProfile, isUpdatingProfile } = useProfileQuery(userId);
  const { user } = useStore();
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState<IUpdateProfileRequest>({
    username: profile?.username || user?.username || '',
    email: profile?.email || user?.email || '',
    name: profile?.name || '',
    description: profile?.description || '',
    avatar: profile?.avatar || user?.avatar || '',
    banner_url: profile?.banner_url || '',
    social_links: profile?.social_links || {}
  });
  
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(
    Object.entries(profile?.social_links || {}).map(([platform, url]) => ({ platform, url }))
  );

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || user?.username || '',
        email: profile.email || user?.email || '',
        name: profile.name || '',
        description: profile.description || '',
        avatar: profile.avatar || user?.avatar || '',
        banner_url: profile.banner_url || '',
        social_links: profile.social_links || {}
      });
      
      setSocialLinks(
        Object.entries(profile.social_links || {}).map(([platform, url]) => ({ platform, url }))
      );
    }
  }, [profile, user]);

  // Reset update status after 3 seconds
  useEffect(() => {
    if (updateStatus !== 'idle') {
      const timer = setTimeout(() => {
        setUpdateStatus('idle');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert social links array to object
    const socialLinksObj: Record<string, string> = {};
    socialLinks.forEach(({ platform, url }) => {
      if (platform && url) {
        socialLinksObj[platform] = url;
      }
    });

    const updateData: IUpdateProfileRequest = {
      ...formData,
      social_links: socialLinksObj
    };

    updateProfile({
      profileId,
      data: updateData
    }, {
      onSuccess: () => {
        setUpdateStatus('success');
        if (onSuccess) onSuccess();
      },
      onError: () => {
        setUpdateStatus('error');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {updateStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Profile updated successfully!
        </div>
      )}
      
      {updateStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Failed to update profile. Please try again.
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          type='file'
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner_url">Banner URL</Label>
        <Input
          type='file'
          id="banner_url"
          name="banner_url"
          value={formData.banner_url}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Social Links</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
            Add Link
          </Button>
        </div>
        
        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Platform (e.g., twitter)"
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline"
                size="icon"
                onClick={() => removeSocialLink(index)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
        {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
} 