import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, createPost } from "./api";
import { Pagination } from "./pagination";

function App() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const newPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data, variable, context) => {
      // console.log(data, variable, context);
      queryClient.setQueryData<any[]>(["posts"], (prev) => prev?.concat(data));
      queryClient.invalidateQueries(["posts"]);
    },
    // onMutate: () => {
    //   return { answer: 42 };
    // },
  });

  if (postsQuery.isLoading) {
    return <p>Loading ...</p>;
  }

  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error, null, 2)}</pre>;
  }

  return (
    <section className="section grid">
      <h1>React Query</h1>
      <button
        disabled={newPostMutation.isLoading}
        onClick={() =>
          newPostMutation.mutate({
            id: crypto.randomUUID(),
            name: `post ${postsQuery.data.length + 1}`,
          })
        }
      >
        {newPostMutation.isLoading ? "Adding ..." : "Add post"}
      </button>
      <pre style={{ opacity: postsQuery.isFetching ? 0.3 : 1 }}>
        {JSON.stringify(postsQuery.data, null, 2)}
      </pre>
      <Pagination />
    </section>
  );
}

export default App;
