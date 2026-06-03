import { auth } from "@/lib/auth"; // Jo bhi aapki better-auth instance ki path hai
import { toNextJsHandler } from "better-auth/next-js";

// Yeh line automatically saare required HTTP methods (GET, POST, etc.) export kar degi
export const { GET, POST } = toNextJsHandler(auth);