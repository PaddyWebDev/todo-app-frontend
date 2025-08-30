import { z, ZodSchema } from "zod";

export async function validateFields(
  schema: ZodSchema,
  data: z.infer<typeof schema>
): Promise<z.infer<typeof schema>> {
  try {
    const response = await schema?.safeParseAsync(data);
    if (response.error) {
      throw new Error("Invalid Input");
    }

    return response.data;
  } catch (error: any) {
    throw new Error("Failed to Validate Fields", error.message);
  }
}
