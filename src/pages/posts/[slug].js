import graphQLClient from "../../lib/graphqlClient";
import { GET_POST_BY_SLUG, GET_ALL_POSTS } from "../../graphql/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export async function getStaticPaths() {
  try {
    const data = await graphQLClient.request(GET_ALL_POSTS);
    const posts = data.blogPostCollection.items;
    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));
    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const data = await graphQLClient.request(GET_POST_BY_SLUG, {
      slug: params.slug,
    });
    const post = data.blogPostCollection.items[0];
    return { props: { post } };
  } catch (error) {
    console.error("Error fetching post", error);
    return { props: { post: null } };
  }
}

export default function Post({ post }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${post.slug}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [post.slug]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;

    const comment = {
      id: Date.now(),
      name,
      content: newComment,
      date: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(
      `comments-${post.slug}`,
      JSON.stringify(updatedComments)
    );
    setNewComment("");
    setName("");
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-indigo-800 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-600">
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Featured Image */}
        {post.featuredImageCollection.items.length > 0 && (
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src={post.featuredImageCollection.items[0].url}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose lg:prose-xl max-w-none bg-white rounded-3xl p-8 shadow-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-8">Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-900 to-indigo-800 text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 last:border-0 pb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{comment.name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
