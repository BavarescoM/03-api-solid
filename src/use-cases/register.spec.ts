import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { expect, test, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to regiter', async () => {
    const { user } = await sut.execute({
      name: 'John doe',
      email: 'jopehdoe@gmail.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John doe',
      email: 'jopehdoe@gmail.com',
      password: '123456',
    })
    const isPasswordCorretlyHandled = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorretlyHandled).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jopehdoe@gmail.com'

    await sut.execute({
      name: 'John doe',
      email,
      password: '123456',
    })
    await expect(() =>
      sut.execute({
        name: 'John doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
