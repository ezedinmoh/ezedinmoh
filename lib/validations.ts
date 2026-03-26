import { z } from "zod"

export const ProjectCreateSchema = z.object({
  title:              z.string().min(1).max(120),
  description:        z.string().min(1).max(1000),
  image:              z.string().url().optional().or(z.literal("")),
  tags:               z.array(z.string()).default([]),
  stack:              z.array(z.string()).default([]),
  category:           z.array(z.string()).default([]),
  liveUrl:            z.string().url().optional().or(z.literal("")),
  githubUrl:          z.string().url().optional().or(z.literal("")),
  featured:           z.boolean().default(false),
  year:               z.string().regex(/^\d{4}$/),
  caseStudyProblem:   z.string().max(2000).optional(),
  caseStudySolution:  z.string().max(2000).optional(),
  caseStudyOutcome:   z.string().max(2000).optional(),
})

export const GuestbookCreateSchema = z.object({
  name:    z.string().min(1).max(40),
  message: z.string().min(1).max(280),
  avatar:  z.string().max(100).optional().or(z.literal("")),
})

export const ContactCreateSchema = z.object({
  name:    z.string().min(2).max(80),
  email:   z.string().email(),
  subject: z.string().min(2).max(120),
  message: z.string().min(10).max(2000),
})

export const AnalyticsEventSchema = z.object({
  path:      z.string().max(500),
  referrer:  z.string().max(500).optional(),
  userAgent: z.string().max(500).optional(),
})

export const ReorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
})

export const GuestbookPatchSchema = z.object({
  pinned:    z.boolean().optional(),
  hostReply: z.string().max(500).optional(),
})

export const ReactSchema = z.object({
  emoji:  z.string().min(1).max(10),
  action: z.enum(["increment", "decrement"]),
})
