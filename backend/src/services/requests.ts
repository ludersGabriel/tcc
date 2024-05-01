import {
  RequestTracker,
  RequestTrackerInput,
} from '../db/schema'
import {
  createRequest,
  findPendingRequests,
  getRequestsByUserId,
  updateRequest,
} from '../repositories/requests'

export async function createRequestService(
  input: RequestTrackerInput
): Promise<RequestTracker> {
  return await createRequest(input)
}

export async function updateRequestService(
  id: number,
  input: Partial<RequestTrackerInput>
): Promise<RequestTracker> {
  return await updateRequest(id, input)
}

export async function findPendingRequestsService(
  type: RequestTracker['requestType']
): Promise<RequestTracker[]> {
  return await findPendingRequests(type)
}

export async function getRequestsByUserIdService(
  userId: number
): Promise<RequestTracker[]> {
  return await getRequestsByUserId(userId)
}
