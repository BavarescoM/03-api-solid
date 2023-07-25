import { afterAll, beforeAll, expect, it, test } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

test('Refresh token e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to Refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'john  doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
