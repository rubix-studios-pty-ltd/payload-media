import { type PayloadRequest } from 'payload'

export const requireAccess = async (req: PayloadRequest): Promise<Response | undefined> => {
  const allowed = await req.payload?.config?.custom?.providerAccess?.({ req })

  if (!allowed) {
    return Response.json(
      { data: null, error: 'You are not allowed to perform this action.' },
      { status: 403 }
    )
  }
}
