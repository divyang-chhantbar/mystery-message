import { z } from "zod";

export const AcceptMessageSchema = z.object({
    identifier : z.boolean(),
})