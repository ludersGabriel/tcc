import { and, eq } from 'drizzle-orm'
import db from '../db/db'
import {
  RequestTracker,
  RequestTrackerInput,
  requests,
} from '../db/schema'

export async function createRequest(
  data: RequestTrackerInput
): Promise<RequestTracker> {
  const [ret] = await db
    .insert(requests)
    .values(data)
    .returning()

  return ret
}

export async function updateRequest(
  id: number,
  data: Partial<RequestTracker>
): Promise<RequestTracker> {
  const [ret] = await db
    .update(requests)
    .set(data)
    .where(eq(requests.id, id))
    .returning()

  return ret
}

export async function findPendingRequests(
  type: RequestTracker['requestType']
): Promise<RequestTracker[]> {
  return await db.query.requests.findMany({
    where: and(
      eq(requests.status, 'pending'),
      eq(requests.requestType, type)
    ),
  })
}

export async function getRequestsByUserId(
  userId: number
): Promise<RequestTracker[]> {
  return await db.query.requests.findMany({
    where: eq(requests.userId, userId),
  })
}
