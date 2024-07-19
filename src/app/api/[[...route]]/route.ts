import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import prisma from '@/lib/db/client'

// export const runtime = 'edge'

const app = new Hono().basePath('/api')


// Fetch users
app.get('/users', async (c) => {
  const users = await prisma.user.findMany({
    include: {
      profile: true
    }
  });
  
  return c.json({
    data: users
  })
})

export const GET = handle(app)
export const POST = handle(app)