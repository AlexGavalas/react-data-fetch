const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPosts = async () => {
  const response = await fetch("http://localhost:4000/posts");

  await wait(1000);

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
};

export const createPost = async (post: any) => {
  const response = await fetch("http://localhost:4000/posts", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await wait(1000);

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
};
