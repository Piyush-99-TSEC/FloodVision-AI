import { AuthUserPayload } from "./index";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
