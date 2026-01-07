import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/server';
import { getBaseUrl } from '@/utils/getURL';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
