import graphQLClient from "../lib/graphqlClient";
import { GET_ALL_POSTS } from "../graphql/queries";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// Updated darker gradients
const getCardGradient = (index) => {
  const gradients = [
    "from-purple-900 via-violet-800 to-purple-700",
    "from-blue-900 via-blue-800 to-indigo-700",
    "from-emerald-900 via-green-800 to-emerald-700",
    "from-rose-900 via-red-800 to-rose-700",
    "from-slate-900 via-gray-800 to-slate-700",
  ];
  return gradients[index % gradients.length];
};

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-8 text-center">
          Your Latest Blog Posts
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-16">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <Link
              href={`/posts/${post.slug}`}
              key={post.slug}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <div
                className={`relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r ${getCardGradient(
                  index
                )} h-full`}
              >
                <div className="relative p-6">
                  <div className="mb-6 rounded-2xl overflow-hidden bg-black/10 backdrop-blur-md h-48">
                    {post.featuredImageCollection.items.length > 0 && (
                      <Image
                        src={post.featuredImageCollection.items[0].url}
                        alt={post.title}
                        width={400}
                        height={350}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight line-clamp-2 h-[60px]">
                      {post.title}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="pt-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg text-white text-sm font-medium transition-colors duration-300 hover:bg-white/20">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results message */}
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
