'use client'

import { PageLayout } from '@/components/layout/PageLayout'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { HydrationWrapper } from '@/components/ui/hydration-wrapper'
import { Users, BookOpen, MessageSquare, Activity, FileText, Calendar } from 'lucide-react'

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
  author: string
  authorImage?: string
  userId: string
}

interface Stats {
  totalPosts: number
  recentPosts: number
  completedModules: number
  totalModules: number
}

interface UserProfile {
  firstName: string
  lastName: string
  bio: string
  imageUrl: string | null
}

function DashboardContent() {
  const { user, isLoaded } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    recentPosts: 0,
    completedModules: 0,
    totalModules: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch('/api/profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        }

        // Fetch posts
        const postsResponse = await fetch('/api/posts')
        const allPosts = await postsResponse.json()
        const userPosts = allPosts.filter((post: Post) => post.userId === user?.id)
        setPosts(userPosts)

        // Fetch user progress
        const progressResponse = await fetch('/api/user-progress?courseId=all')
        if (progressResponse.ok) {
          const progress = await progressResponse.json()
          setStats({
            totalPosts: userPosts.length,
            recentPosts: userPosts.filter((post: Post) => 
              new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            completedModules: progress.completedModules?.length || 0,
            totalModules: progress.totalModules || 0
          })
        } else {
          // Set default values if progress fetch fails
          setStats({
            totalPosts: userPosts.length,
            recentPosts: userPosts.filter((post: Post) => 
              new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            completedModules: 0,
            totalModules: 0
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchUserData()
    }
  }, [user?.id])

  if (!isLoaded || isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-muted rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome back,
          </motion.span>
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
            {profile?.firstName || user?.firstName || user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')?.[0] || 'Guest'}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: 0.6,
              type: "spring",
              bounce: 0.5
            }}
          >
            👋
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-muted-foreground text-lg"
        >
          Continue your journey in wildlife conservation.
        </motion.p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-xl p-6 border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <h3 className="text-2xl font-bold">{stats.totalPosts}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-xl p-6 border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Posts (last 7 days)</p>
              <h3 className="text-2xl font-bold">{stats.recentPosts}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-xl p-6 border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Modules</p>
              <h3 className="text-2xl font-bold">{stats.completedModules}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-xl p-6 border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Learning Progress</p>
              <h3 className="text-2xl font-bold">
                {stats.totalModules > 0 
                  ? Math.round((stats.completedModules / stats.totalModules) * 100)
                  : 0}%
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/community">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground mb-4">
              Connect with fellow conservationists and share your experiences.
            </p>
            <Button variant="ghost" className="w-full">View Community</Button>
          </motion.div>
        </Link>

        <Link href="/learn">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learning</h3>
            <p className="text-muted-foreground mb-4">
              Access educational resources and stay updated with conservation practices.
            </p>
            <Button variant="ghost" className="w-full">Continue Learning</Button>
          </motion.div>
        </Link>

        <Link href="/chat">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chat</h3>
            <p className="text-muted-foreground mb-4">
              Engage in real-time discussions about wildlife conservation.
            </p>
            <Button variant="ghost" className="w-full">Start Chatting</Button>
          </motion.div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recent Posts</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.slice(0, 3).map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-6 border shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {post.author.substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">{post.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border">
            <p className="text-muted-foreground">No posts yet. Share your first conservation story!</p>
            <Link href="/community">
              <Button variant="outline" className="mt-4">Create Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <PageLayout>
      <HydrationWrapper>
        <DashboardContent />
      </HydrationWrapper>
    </PageLayout>
  )
} 