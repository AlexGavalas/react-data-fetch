import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetchPosts, createPost } from "./api";

function App() {
  const postsQuery = useSWR(["posts"], fetchPosts);
  const { trigger, isMutating } = useSWRMutation(["posts"], (_, { arg }) =>
    createPost(arg)
  );

  if (postsQuery.isLoading) {
    return <p>Loading ...</p>;
  }

  if (postsQuery.error) {
    return <pre>{JSON.stringify(postsQuery.error, null, 2)}</pre>;
  }

  return (
    <section className="section grid">
      <h1>SWR</h1>
      <button
        disabled={isMutating}
        onClick={() =>
          trigger({
            id: crypto.randomUUID(),
            name: `post ${postsQuery.data.length + 1}`,
          })
        }
      >
        {postsQuery.isLoading ? "Adding ..." : "Add post"}
      </button>
      <pre style={{ opacity: postsQuery.isValidating ? 0.3 : 1 }}>
        {JSON.stringify(postsQuery.data, null, 2)}
      </pre>
    </section>
  );
}

export default App;
