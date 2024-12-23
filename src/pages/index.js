import graphQLClient from "../lib/graphqlClient";
import { GET_ALL_POSTS } from "../graphql/queries";
import Link from "next/link";
import Image from "next/image";

export async function getStaticProps() {
  try {
    const data = await graphQLClient.request(GET_ALL_POSTS);
    const posts = data.blogPostCollection.items;
    return {
      props: { posts },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { props: { posts: [] } };
  }
}

export default function Home({ posts }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/posts/${post.slug}`} legacyBehavior key={post.slug}>
              <a className="block">
                <div className="relative h-64 w-full">
                  {" "}
                  {/* Fixed height for image container */}
                  {post.featuredImageCollection.items.length > 0 && (
                    <Image
                      src={post.featuredImageCollection.items[0].url}
                      alt={post.title}
                      layout="fill" // Important for responsive images
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  )}
                </div>
                <div className="p-6 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
