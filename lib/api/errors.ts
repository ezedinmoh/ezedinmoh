import { NextResponse } from "next/server"

export function errorResponse(message: string, status: number, errors?: { field: string; message: string }[]) {
  return NextResponse.json({ message, ...(errors ? { errors } : {}) }, { status })
}

export function notFound(message = "Not found") {
  return errorResponse(message, 404)
}

export function unauthorized() {
  return errorResponse("Unauthorized", 401)
}

export function serverError(message = "Internal server error") {
  return errorResponse(message, 500)
}
