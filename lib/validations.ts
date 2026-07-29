import { z } from "zod"

export const ProjectCreateSchema = z.object({
  title:              z.string().min(1, "Title is required").max(120, "Title is too long"),
  description:        z.string().min(1, "Description is required").max(2000, "Description is too long"),
  image:              z.string().optional().nullable().or(z.literal("")),
  screenshots:        z.array(z.string()).default([]),
  tags:               z.array(z.string()).default([]),
  stack:              z.array(z.string()).default([]),
  category:           z.array(z.string()).default([]),
  liveUrl:            z.string().optional().nullable().or(z.literal("")),
  githubUrl:          z.string().optional().nullable().or(z.literal("")),
  featured:           z.boolean().default(false),
  year:               z.string().default("2026"),
  previewMode:        z.enum(["slideshow", "iframe"]).default("iframe"),
  caseStudyProblem:   z.string().optional().nullable().or(z.literal("")),
  caseStudySolution:  z.string().optional().nullable().or(z.literal("")),
  caseStudyOutcome:   z.string().optional().nullable().or(z.literal("")),
})

export const GuestbookCreateSchema = z.object({
  name:    z.string().min(1).max(40),
  message: z.string().min(1).max(280),
  avatar:  z.string().max(100).optional().or(z.literal("")),
})

export const ContactCreateSchema = z.object({
  name:    z.string().min(1).max(80),
  email:   z.string().email(),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
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
