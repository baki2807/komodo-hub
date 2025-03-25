'use client'

import { Navbar } from '@/components/Navbar'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { Upload, X } from 'lucide-react'
import { ImageViewer } from '@/components/ui/ImageViewer'
import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/PageLayout'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'

interface Media {
  type: 'image' | 'video'
  url: string
  file?: File
}

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
  author: string
  authorImage?: string
  userId: string
  media?: Media[]
}

function CommunityContent() {
  const { user, isLoaded } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState({ content: '', media: [] as Media[] })
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newMedia: Media[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue

      // Check file type
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' : null
      
      if (!type) {
        toast.error(`File ${file.name} is not a supported format`)
        continue
      }

      // Check file size (50MB for videos, 5MB for images)
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${type === 'video' ? '50MB' : '5MB'}`)
        continue
      }

      // Create temporary URL for preview
      const url = URL.createObjectURL(file)
      newMedia.push({ type, url, file })
    }

    setNewPost(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }))
  }

  const removeMedia = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }))
  }

  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      console.log('Uploading file:', file.name, file.type, file.size)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', errorText)
        throw new Error(`Failed to upload media: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Upload successful:', data.url)
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Please sign in to create a post')
      return
    }

    if (!newPost.content.trim() && newPost.media.length === 0) {
      toast.error('Please write something or add media to post')
      return
    }

    setIsLoading(true)
    try {
      console.log('Creating post - Starting upload process');
      // Upload all media files first
      const uploadPromises = newPost.media
        .filter(m => m.file)
        .map(async m => {
          try {
            console.log('Uploading media file:', { name: m.file?.name, type: m.type });
            const url = await uploadMedia(m.file!)
            console.log('Media upload successful:', { url });
            return {
              type: m.type,
              url
            }
          } catch (error) {
            console.error(`Failed to upload ${m.file?.name}:`, error)
            toast.error(`Failed to upload ${m.file?.name}`)
            return null
          }
        })

      const uploadedMedia = (await Promise.all(uploadPromises)).filter(Boolean)
      console.log('Media uploads completed:', { count: uploadedMedia.length });

      if (uploadedMedia.length < newPost.media.length) {
        toast.error('Some media files failed to upload')
        return
      }

      const postData = {
        title: 'Community Post',
        content: newPost.content,
        media: uploadedMedia
      };
      
      console.log('Sending post request with data:', postData);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      })

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        console.error('Post creation failed:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        });
        throw new Error(`Failed to create post: ${responseText}`)
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Post created successfully:', data);
      setPosts(prev => [data, ...prev])
      setNewPost({ content: '', media: [] })
      toast.success('Post created successfully!')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      setPosts(prev => prev.filter(post => post._id !== postId))
      toast.success('Post deleted successfully!')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-muted rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 max-w-2xl"
      >
        <h1 className="text-4xl font-bold mb-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Community
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4,
              type: "spring",
              stiffness: 200
            }}
            className="text-primary"
          >
            Hub
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          Connect with fellow conservationists, share your experiences, and learn from others in our community.
        </motion.p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
          >
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your thoughts with the community..."
              className="w-full h-32 p-4 rounded-lg bg-muted text-card-foreground border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200"
              disabled={isLoading}
            />
            
            {/* Media Preview */}
            {newPost.media.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 mt-4"
              >
                {newPost.media.map((media, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-video rounded-lg overflow-hidden group"
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        setNewPost(prev => ({
                          ...prev,
                          media: prev.media.filter((_, i) => i !== index)
                        }))
                        if (media.file) URL.revokeObjectURL(media.url)
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Add Media
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  disabled={isLoading}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleCreatePost}
                  disabled={isLoading || (!newPost.content.trim() && newPost.media.length === 0)}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 mb-4"
                >
                  {post.authorImage ? (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      src={post.authorImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      <span className="text-primary font-semibold">
                        {post.author.substring(0, 2)}
                      </span>
                    </motion.div>
                  )}
                  <div>
                    <h3 className="font-semibold text-card-foreground">{post.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {user?.id === post.userId && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post._id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-card-foreground mb-4"
                >
                  {post.content}
                </motion.p>
                {post.media && post.media.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {post.media.map((media, mediaIndex) => (
                      <motion.div
                        key={mediaIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + mediaIndex * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        {media.type === 'image' ? (
                          <button
                            onClick={() => setSelectedImage(media.url)}
                            className="w-full h-full"
                          >
                            <img
                              src={media.url}
                              alt="Post media"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-semibold mb-4"
            >
              Community Guidelines
            </motion.h2>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3 text-muted-foreground"
            >
              {[
                'Be respectful and supportive',
                'Share authentic experiences',
                'Keep discussions on topic',
                'Protect wildlife information'
              ].map((guideline, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  • {guideline}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </>
  )
}

export default function CommunityPage() {
  return (
    <PageLayout>
      <HydrationWrapper>
        <CommunityContent />
      </HydrationWrapper>
    </PageLayout>
  )
} 