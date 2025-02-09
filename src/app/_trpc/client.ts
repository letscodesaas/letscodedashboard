import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/server';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});