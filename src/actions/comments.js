"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function saveComment(state, formData) {
  const { postId, parentCommentId } = state;
  const session = await auth();
  if (!session?.user?.id) {
    return { ...state, error: "Please log in to comment." };
  }

  await db.query(
    "INSERT INTO comments (user_id, post_id, parent_comment_id, body) VALUES ($1, $2, $3, $4)",
    [session.user.id, postId, parentCommentId, formData.get("comment")]
  );

  revalidatePath(`/post/${postId}`);
  return { postId, parentCommentId, success: true };
}
