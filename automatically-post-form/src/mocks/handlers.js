import { rest } from "msw";

export const handlers = [
  rest.post("/user", (req, res, ctx) => {
    const RESPONSE_STATUS_CODE = 200;
    const RESPONSE_DELAY = 0;
    return res(ctx.status(RESPONSE_STATUS_CODE), ctx.delay(RESPONSE_DELAY));
  }),
];
