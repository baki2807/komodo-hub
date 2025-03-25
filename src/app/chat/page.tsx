'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useRef, KeyboardEvent, ChangeEvent, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Send, Trash2, MoreVertical } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  _id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string
    image: string
  }
  receiver: {
    id: string
    name: string
    image: string
  }
}

interface User {
  id: string
  name: string
  image: string
}

function ChatContent() {
  const { user, isLoaded } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isDeletingMessage, setIsDeletingMessage] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      
      // Format users for the UI
      const formattedUsers = data.map((user: any) => ({
        id: user.clerkId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
        image: user.imageUrl || ''
      }));
      
      // Filter out the current user and any obvious test users
      const filteredUsers = formattedUsers.filter(
        (u: { id: string, name: string }) => 
          u.id !== user?.id && 
          !u.name.toLowerCase().includes('test') &&
          !u.name.toLowerCase().includes('anonymous')
      );
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [user]);

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to fetch messages')
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchUsers()
    }
  }, [isLoaded, user, fetchUsers])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
    }
  }, [selectedUser])

  const handleSendMessage = async () => {
    if (!user || !selectedUser) {
      toast.error('Please select a user to message')
      return
    }

    if (!newMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser.id
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      setMessages(prev => [...prev, data])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete messages')
      return
    }

    setIsDeletingMessage(messageId)
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete message')

      setMessages(prev => prev.filter(msg => msg._id !== messageId))
      toast.success('Message deleted')
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    } finally {
      setIsDeletingMessage(null)
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Users</h2>
            {isLoadingUsers ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No users found</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {users.map((u) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === u.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    {u.image ? (
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-muted"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {u.name.substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{u.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="md:col-span-2 bg-card rounded-xl p-6 border shadow-sm">
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-6 border-b pb-3">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-muted"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {selectedUser.name.substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold">{selectedUser.name}</h2>
                  </div>
                </div>

                <div 
                  ref={chatContainerRef} 
                  className="h-[60vh] overflow-y-auto mb-4 space-y-4 pr-2 pb-2"
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-2 ${
                          message.sender.id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender.id !== user?.id && (
                          <img
                            src={message.sender.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}&background=random`}
                            alt={message.sender.name}
                            className="w-8 h-8 rounded-full object-cover mt-1 border border-muted"
                          />
                        )}
                        
                        <div
                          className={`max-w-[70%] rounded-lg p-3 relative group ${
                            message.sender.id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.sender.id !== user?.id && (
                            <p className="text-xs font-semibold mb-1">{message.sender.name}</p>
                          )}
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                          
                          {message.sender.id === user?.id && (
                            <div className="absolute right-0 top-0 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive flex items-center gap-2"
                                    onClick={() => handleDeleteMessage(message._id)}
                                    disabled={isDeletingMessage === message._id}
                                  >
                                    {isDeletingMessage === message._id ? (
                                      <span>Deleting...</span>
                                    ) : (
                                      <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                        
                        {message.sender.id === user?.id && (
                          <img
                            src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || '')}&background=random`}
                            alt={user.fullName || 'You'}
                            className="w-8 h-8 rounded-full object-cover mt-1 border border-muted"
                          />
                        )}
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isLoading}
                    className="bg-background"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center h-[60vh]">
                <p className="text-muted-foreground mb-2">Select a user to start chatting</p>
                <p className="text-xs text-muted-foreground">Messages are private and end-to-end encrypted</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ChatPage() {
  return <ChatContent />
} 