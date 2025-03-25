'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export default function FixAvatar() {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFixAvatar = async () => {
    if (!user) {
      toast.error('User not logged in');
      return;
    }

    setIsUpdating(true);
    try {
      // Call our development webhook to update the user's profile
      const response = await fetch('/api/dev-webhook/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType: 'user.updated',
          data: {
            id: user.id,
            email_addresses: user.emailAddresses.map(email => ({
              email_address: email.emailAddress
            })),
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Update result:', result);
      
      toast.success('Profile updated successfully! Refresh the page.');
      
      // Reload the page after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleFixAvatar} 
      disabled={isUpdating}
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
    >
      <RefreshCw className="w-3.5 h-3.5" />
      {isUpdating ? 'Updating...' : 'Fix Avatar'}
    </Button>
  );
} 