import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import prisma from '@/lib/db/client';
import { convertToPrismaQuery } from "@/lib/helpers/query-to-prisma";

// Initialize the Hono app with a base path of '/api'
const app = new Hono().basePath('/api');

// Fetch users endpoint
app.get('/users', async (c) => {
  // Get the query parameter from the request
  const query = c.req.query('query');
  
  // If a query is provided, convert it to a Prisma query and fetch users based on the converted query
  if (query) {
    const prismaQuery = convertToPrismaQuery(JSON.parse(decodeURIComponent(query || "")));
    
    const users = await prisma.user.findMany({
      where: prismaQuery,
      include: {
        profile: true // Include related profile information
      },
    });
    return c.json({
      data: users
    });
  } else {
    // If no query is provided, fetch all users with their profile information
    const users = await prisma.user.findMany({
      include: {
        profile: true // Include related profile information
      },
    });
    return c.json({
      data: users
    });
  }
});

// Export the GET handler for the Vercel deployment
export const GET = handle(app);
