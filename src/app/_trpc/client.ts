import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/server';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `/api/trpc`,
    }),
  ],
});
