import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteForm } from "./VoteForm";

async function getExistingVote(userId, postId) {
  const { rows: existingVotes } = await db.query(
    "SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 LIMIT 1",
    [userId, postId]
  );

  return existingVotes?.[0];
}

async function handleVote(userId, postId, newVote) {
  const existingVote = await getExistingVote(userId, postId);

  if (existingVote) {
    if (existingVote.vote === newVote) {
      await db.query("DELETE FROM votes WHERE id = $1", [existingVote.id]);
    } else {
      await db.query("UPDATE votes SET vote = $1 WHERE id = $2", [
        newVote,
        existingVote.id,
      ]);
    }
  } else {
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, 'post')",
      [userId, postId, newVote]
    );
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");
}

export async function voteAction(postId, direction) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to vote." };
  }
  try {
    await handleVote(session.user.id, postId, direction);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function Vote({ postId, votes }) {
  const session = await auth();
  const existingVote = await getExistingVote(session?.user?.id, postId);

  return (
    <VoteForm
      postId={postId}
      votes={votes}
      existingVote={existingVote}
      voteAction={voteAction}
    />
  );
}
