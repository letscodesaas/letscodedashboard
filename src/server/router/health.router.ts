import { publicProcedure, router } from "../trpc";

export const healthRouter = router({
  checkHealth: publicProcedure.query(() => {
    return { status: "ok", message: "Health check successful" };
  }),
});
