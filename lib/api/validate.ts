import { NextResponse } from "next/server"
import { ZodSchema, ZodError } from "zod"

export async function validateBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    const errors = (result.error as ZodError).errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }))
    throw NextResponse.json({ message: "Validation failed", errors }, { status: 422 })
  }

  return result.data
}
