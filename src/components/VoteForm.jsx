"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbArrowBigUp,
  TbArrowBigUpFilled,
} from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";

export function VoteForm({ postId, votes, existingVote, voteAction }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [voteError, setVoteError] = useState(null);

  function handleVote(direction) {
    setVoteError(null);
    setIsPending(true);
    voteAction(postId, direction).then((result) => {
      setIsPending(false);
      if (result?.error) {
        setVoteError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center space-x-3 pl-3">
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={isPending}
          className="disabled:opacity-50"
          aria-label="Upvote"
        >
          {existingVote?.vote === 1 ? (
            <TbArrowBigUpFilled
              size={24}
              className={clsx("hover:text-orange-600", "text-pink-300")}
            />
          ) : (
            <TbArrowBigUp
              size={24}
              className="hover:text-orange-600"
            />
          )}
        </button>
        <span className="w-6 text-center tabular-nums">
          {isPending ? (
            <span className="animate-spin h-6 w-6 flex items-center justify-center">
              <FaSpinner />
            </span>
          ) : (
            votes
          )}
        </span>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={isPending}
          className="disabled:opacity-50"
          aria-label="Downvote"
        >
          {existingVote?.vote === -1 ? (
            <TbArrowBigDownFilled
              size={24}
              className={clsx("hover:text-blue-600", "text-blue-300")}
            />
          ) : (
            <TbArrowBigDown
              size={24}
              className="hover:text-blue-600"
            />
          )}
        </button>
      </div>
      {voteError && (
        <p className="text-red-500 text-sm pl-3" role="alert">
          {voteError}
        </p>
      )}
    </div>
  );
}
