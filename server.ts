import express from "express";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import cors from "cors";
import { WebSocketServer } from "ws";
import { EventEmitter } from "node:events";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createContext = async () => ({ db: {} });
const eventEmitter = new EventEmitter();

const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

const isAdminMiddleware = t.middleware((req) => {
  if (!req.ctx.db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  return req.next();
});

const trpcRouter = t.router({
  sayHi: t.procedure.query(async () => {
    await wait(1000);
    return "hi";
  }),
  logServer: t.procedure
    .input((v) => {
      if (typeof v === "string") return v;

      throw new Error("Input is not a string");
    })
    .mutation(async (req) => {
      await wait(1000);
      console.log(`Client says ${req.input}`);
      eventEmitter.emit("update", "user id");
      return true;
    }),
  isAdmin: t.procedure.use(isAdminMiddleware).query(() => {
    return { passed: true };
  }),
  onLogServer: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: trpcRouter,
    createContext,
  })
);

const server = app.listen(4001, () => {
  console.log(`Express server started on port 4001`);
});

applyWSSHandler({
  wss: new WebSocketServer({ server }),
  router: trpcRouter,
  createContext,
});

export type AppRouter = typeof trpcRouter;
