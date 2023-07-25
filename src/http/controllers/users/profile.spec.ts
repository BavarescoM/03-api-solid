import { afterAll, beforeAll, expect, it, test } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'

test('Profile e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.body.user).toEqual({
      email: 'johndoe@example.com',
    })
  })
})
