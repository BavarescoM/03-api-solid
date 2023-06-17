import { afterAll, beforeAll, expect, it, test } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

test('Register e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'john  doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(response.statusCode).toEqual(201)
  })
})
