import { trpc } from "./trpc-client";

const Trpc = () => {
  trpc.isAdmin.useQuery();
  const data = trpc.sayHi.useQuery();
  const logServer = trpc.logServer.useMutation();

  trpc.onLogServer.useSubscription(undefined, {
    onData: (data) => {
      console.log("Data from ws ", data);
    },
  });

  if (data.isLoading) {
    return <p>Loading ...</p>;
  }

  if (data.isError) {
    return <p>Error</p>;
  }

  return (
    <section className="section grid">
      <h1>tRPC</h1>
      <button onClick={() => logServer.mutate("123")}>
        Call logServer RPC
      </button>
      <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </section>
  );
};

export default Trpc;
