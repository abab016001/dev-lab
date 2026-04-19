import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string()
    }),
    handler: async (input) => {
      return `你好 ${input.name}，這是來自伺服器的回覆！`;
    }
  }),
  postComment: defineAction({
    input: z.object({
      author: z.string(),
      content: z.string().min(5),
    }),
    handler: async (input) => {
      console.log(input);
      return "留言成功";
    }
  }),
}