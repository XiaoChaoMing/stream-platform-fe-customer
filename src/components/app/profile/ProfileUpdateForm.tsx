import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileQuery } from '@/hooks/useProfileQuery';
import { IUpdateProfileWithFilesRequest } from '@/types/app/IProfile.type';
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
  
  // References to file inputs
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  
  // Form data state - removed username and email
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    avatar: profile?.avatar || user?.avatar || '',
    banner_url: profile?.banner_url || '',
  });
  
  // File state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  // Image previews
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(
    Object.entries(profile?.social_links || {}).map(([platform, url]) => ({ platform, url }))
  );

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        avatar: profile.avatar || user?.avatar || '',
        banner_url: profile.banner_url || '',
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

  // Log current user state for debugging
  useEffect(() => {
    
  }, [user]);

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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'avatar' | 'banner') => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Update file state
      if (fileType === 'avatar') {
        setAvatarFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
      } else {
        setBannerFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
      }
    }
  };

  // Handle removing selected file
  const removeFile = (fileType: 'avatar' | 'banner') => {
    if (fileType === 'avatar') {
      setAvatarFile(null);
      setAvatarPreview(null);
      if (avatarFileRef.current) {
        avatarFileRef.current.value = '';
      }
    } else {
      setBannerFile(null);
      setBannerPreview(null);
      if (bannerFileRef.current) {
        bannerFileRef.current.value = '';
      }
    }
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

    // Prepare form data - without username and email
    const updateData: IUpdateProfileWithFilesRequest = {
      name: formData.name,
      description: formData.description,
      // Convert social links object to JSON string
      social_links: JSON.stringify(socialLinksObj),
    };

    // Add files if they exist
    if (avatarFile) {
      updateData.avatarFile = avatarFile;
    }
    
    if (bannerFile) {
      updateData.bannerFile = bannerFile;
    }

    // Call update profile
    updateProfile({
      userId: Number(userId),
      data: updateData
    }, {
      onSuccess: (data) => {
        setUpdateStatus('success');
        
        // Reset file inputs
        setAvatarFile(null);
        setBannerFile(null);
        setAvatarPreview(null);
        setBannerPreview(null);
        if (avatarFileRef.current) avatarFileRef.current.value = '';
        if (bannerFileRef.current) bannerFileRef.current.value = '';
        
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error('Profile update failed:', error);
        setUpdateStatus('error');
      }
    });
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [avatarPreview, bannerPreview]);

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
      
      {/* Display username and email as read-only fields */}
      <div className="grid-cols-2 gap-4 hidden">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={user?.username || ''}
            readOnly
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500">Username cannot be changed</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ''}
            readOnly
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
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
        <Label>Avatar Image</Label>
        <div className="flex flex-col space-y-2">
          {/* Current avatar display */}
          {(formData.avatar || avatarPreview) && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-input">
              <img 
                src={avatarPreview || formData.avatar} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* File input */}
          <div className="flex items-center gap-2">
            <Input
              ref={avatarFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'avatar')}
              className="flex-1"
            />
            {avatarFile && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeFile('avatar')}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div className="flex flex-col space-y-2">
          {/* Current banner display */}
          {(formData.banner_url || bannerPreview) && (
            <div className="relative w-full h-32 rounded-md overflow-hidden border border-input">
              <img 
                src={bannerPreview || formData.banner_url} 
                alt="Banner Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* File input */}
          <div className="flex items-center gap-2">
            <Input
              ref={bannerFileRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileChange(e, 'banner')}
              className="flex-1"
            />
            {bannerFile && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeFile('banner')}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
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