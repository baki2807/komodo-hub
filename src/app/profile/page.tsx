'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Camera, Link as LinkIcon, Twitter, Github, Linkedin, Mail, Edit2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import FixAvatar from './fix-avatar'

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
  author: string
  authorImage?: string
  userId: string
  media?: Array<{ type: 'image' | 'video', url: string }>
}

interface User {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  bio: string
  imageUrl: string | null
  coverImageUrl: string | null
  metadata: any
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [socialLinks, setSocialLinks] = useState<User['socialLinks']>({})
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [activityStats, setActivityStats] = useState({
    totalPosts: 0,
    recentPosts: 0,
    lastPostDate: null as string | null,
    mostActiveDay: '',
    mostActiveTime: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverPhotoRef = useRef<HTMLInputElement>(null)

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      const allPosts = await response.json()
      const userPosts = allPosts.filter((post: Post) => post.userId === user?.id)
      setPosts(userPosts)

      // Calculate activity stats
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      // Get posts from the last week
      const recentPosts = userPosts.filter(
        (post: Post) => new Date(post.createdAt) > oneWeekAgo
      )

      // Calculate most active day and time
      const postTimes = userPosts.map((post: Post) => new Date(post.createdAt))
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayCount = new Array(7).fill(0)
      const hourCount = new Array(24).fill(0)

      postTimes.forEach((date: Date) => {
        dayCount[date.getDay()]++
        hourCount[date.getHours()]++
      })

      const mostActiveDay = days[dayCount.indexOf(Math.max(...dayCount))]
      const mostActiveHour = hourCount.indexOf(Math.max(...hourCount))
      const mostActiveTime = `${mostActiveHour % 12 || 12}${mostActiveHour >= 12 ? 'PM' : 'AM'}`

      setActivityStats({
        totalPosts: userPosts.length,
        recentPosts: recentPosts.length,
        lastPostDate: userPosts[0]?.createdAt || null,
        mostActiveDay,
        mostActiveTime
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load activity')
    }
  }, [user?.id])

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile()
      fetchUserPosts()
    }
  }, [isLoaded, user, fetchUserPosts])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data: User = await response.json()
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
      setBio(data.bio || '')
      setProfileImage(data.imageUrl)
      setCoverImage(data.coverImageUrl)
      setSocialLinks(data.socialLinks || {})
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      await user?.setProfileImage({ file })
      const imageUrl = user?.imageUrl || null
      
      // Update profile in database with new image URL
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          imageUrl,
          metadata: { imageUpdated: new Date().toISOString() }
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')
      
      setProfileImage(imageUrl)
      toast.success('Profile picture updated!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to update profile picture')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      
      // Upload cover image to your storage service
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'cover')
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) throw new Error('Failed to upload cover image')
      const { url } = await uploadResponse.json()
      
      // Update profile with new cover image URL
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          imageUrl: profileImage,
          coverImageUrl: url,
          metadata: { coverImageUpdated: new Date().toISOString() }
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')
      
      setCoverImage(url)
      toast.success('Cover image updated!')
    } catch (error) {
      console.error('Error uploading cover image:', error)
      toast.error('Failed to update cover image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          imageUrl: profileImage,
          coverImageUrl: coverImage,
          email: user?.emailAddresses[0]?.emailAddress,
          socialLinks
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      // Update Clerk user info if available
      try {
        if (user) {
          const updateData: { firstName?: string; lastName?: string } = {}
          
          // Only include fields that have values
          if (firstName.trim()) updateData.firstName = firstName
          if (lastName.trim()) updateData.lastName = lastName
          
          // Only attempt update if we have data to update
          if (Object.keys(updateData).length > 0) {
            await user.update(updateData)
          }
        }
      } catch (clerkError) {
        console.error('Error updating Clerk user:', clerkError)
        // Don't show error to user since the database update was successful
        // and this won't affect app functionality
      }

      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const renderEditableProfile = () => (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="First Name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="Last Name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium text-muted-foreground">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 rounded-md border bg-background min-h-24"
          placeholder="Tell us about yourself and your conservation interests..."
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Social Links</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Twitter className="w-4 h-4 text-muted-foreground" />
            <label htmlFor="twitter" className="text-sm">Twitter</label>
          </div>
          <input
            id="twitter"
            type="text"
            value={socialLinks?.twitter || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="https://twitter.com/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Github className="w-4 h-4 text-muted-foreground" />
            <label htmlFor="github" className="text-sm">GitHub</label>
          </div>
          <input
            id="github"
            type="text"
            value={socialLinks?.github || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Linkedin className="w-4 h-4 text-muted-foreground" />
            <label htmlFor="linkedin" className="text-sm">LinkedIn</label>
          </div>
          <input
            id="linkedin"
            type="text"
            value={socialLinks?.linkedin || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
            <label htmlFor="website" className="text-sm">Website</label>
          </div>
          <input
            id="website"
            type="text"
            value={socialLinks?.website || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
            className="w-full p-3 rounded-md border bg-background"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={handleSaveProfile} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(false)}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  const renderSocialLinks = () => {
    const links: JSX.Element[] = [];
    
    if (socialLinks?.twitter) {
      links.push(
        <a key="twitter" href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </a>
      );
    }
    
    if (socialLinks?.github) {
      links.push(
        <a key="github" href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      );
    }
    
    if (socialLinks?.linkedin) {
      links.push(
        <a key="linkedin" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>
      );
    }
    
    if (socialLinks?.website) {
      links.push(
        <a key="website" href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <LinkIcon className="w-4 h-4" />
          <span>Website</span>
        </a>
      );
    }
    
    return links.length ? (
      <div className="flex flex-wrap gap-4 mt-4">
        {links}
      </div>
    ) : null;
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-muted rounded-xl mb-8"></div>
            <div className="h-32 w-32 bg-muted rounded-full mx-auto -mt-16 mb-4 relative z-10"></div>
            <div className="h-8 bg-muted rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Cover Image Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-64 bg-muted"
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/5" />
        )}
        <label className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg cursor-pointer hover:bg-background transition-all">
          <Camera className="w-5 h-5 text-foreground" />
          <input
            type="file"
            ref={coverPhotoRef}
            className="hidden"
            accept="image/*"
            onChange={handleCoverImageUpload}
            disabled={isLoading}
          />
        </label>
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-32 h-32 mx-auto relative">
              <img
                src={profileImage || user?.imageUrl || '/default-avatar.png'}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full rounded-full object-cover border-4 border-background"
                onError={(e) => {
                  // If the image fails to load, fallback to the default avatar
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = '/default-avatar.png';
                }}
              />
              <label className="absolute bottom-0 right-0 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full p-2 cursor-pointer">
                <Camera className="w-4 h-4 text-primary" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </motion.div>
          
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold">
              {firstName} {lastName}
            </h1>
            <p className="text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
            
            <div className="flex justify-center gap-3 mt-4">
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </Button>
              
              {/* Fix Avatar button for development */}
              <FixAvatar />
            </div>
            
            {renderSocialLinks()}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Bio and Social */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="md:col-span-2 space-y-6"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Bio</h2>
                {isEditing ? (
                  renderEditableProfile()
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {bio || 'No bio yet'}
                  </p>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column - Stats and Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Activity</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="font-medium">{activityStats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Posts This Week</span>
                    <span className="font-medium">{activityStats.recentPosts}</span>
                  </div>
                  {activityStats.lastPostDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Last Post</span>
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(activityStats.lastPostDate), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                  {activityStats.mostActiveDay && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Most Active Day</span>
                      <span className="font-medium">{activityStats.mostActiveDay}</span>
                    </div>
                  )}
                  {activityStats.mostActiveTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Peak Activity Time</span>
                      <span className="font-medium">{activityStats.mostActiveTime}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Engagement</h2>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Goal</span>
                      <span className="text-primary">{activityStats.recentPosts}/5 posts</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(activityStats.recentPosts / 5 * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
} 