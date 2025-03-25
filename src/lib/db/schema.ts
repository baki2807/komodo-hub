import { relations } from 'drizzle-orm'
import { 
  pgTable, 
  text, 
  timestamp, 
  varchar, 
  uuid,
  jsonb
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).default(''),
  lastName: varchar('last_name', { length: 255 }).default(''),
  imageUrl: text('image_url').default(''),
  coverImageUrl: text('cover_image_url').default(''),
  bio: text('bio').default(''),
  socialLinks: jsonb('social_links').default({}).$type<{
    twitter?: string,
    github?: string,
    linkedin?: string,
    website?: string
  }>(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull().default('Community Post'),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  media: jsonb('media').default([]).$type<Array<{ type: 'image' | 'video', url: string }>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  level: varchar('level', { length: 50 }).notNull(),
  modules: jsonb('modules').default([]).$type<Array<{
    id: string,
    title: string,
    content: string,
    order: number
  }>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  completedModules: jsonb('completed_modules').default([]).$type<string[]>(),
  lastAccessed: timestamp('last_accessed').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
export type UserProgress = typeof userProgress.$inferSelect
export type NewUserProgress = typeof userProgress.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export const coursesRelations = relations(courses, ({ many }) => ({
  progress: many(userProgress)
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id]
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id]
  })
})) 