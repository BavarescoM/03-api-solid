import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeFecthCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make=search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryBodySchema.parse(req.query)
  const fetchUserCheckInsHistoryUseCase = makeFecthCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: req.user.sub,
    page,
  })

  return reply.status(201).send({
    checkIns,
  })
}
