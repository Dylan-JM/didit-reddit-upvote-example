"use client";

import { saveComment } from "@/actions/comments";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { CommentFormButton } from "./CommentFormButton";

export function CommentForm({ postId, parentCommentId }) {
  const [state, dispatch] = useActionState(saveComment, {
    postId,
    parentCommentId,
  });
  const boundDispatch = dispatch;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <div className="ml-4">
      <button onClick={() => setOpen(!isOpen)} className="text-zinc-400">
        {isOpen ? "Close" : "Reply"}
      </button>
      {isOpen ? (
        <>
          {state?.error && (
            <p className="text-red-500 text-sm mb-2">{state.error}</p>
          )}
          <form action={boundDispatch} className="flex flex-col space-y-3">
            <textarea
              name="comment"
              className="bg-zinc-200 p-3 rounded"
              placeholder="Type your comment..."
            />
            <CommentFormButton />
          </form>
        </>
      ) : null}
    </div>
  );
}
