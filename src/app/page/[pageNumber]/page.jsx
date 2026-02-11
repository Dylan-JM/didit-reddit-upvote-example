import { PostList } from "@/components/PostList";

export default async function PageNumberRoute({ params }) {
  const { pageNumber } = await params;
  return (
    <div>
      <PostList currentPage={parseInt(pageNumber, 10)} />
    </div>
  );
}
