import graphQLClient from "../../lib/graphqlClient";
import { GET_POST_BY_SLUG, GET_ALL_POSTS } from "../../graphql/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Image from "next/image";

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
  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto p-4 prose lg:prose-xl">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.featuredImageCollection.items.length > 0 && ( // Add this check
        <div className="relative w-full h-[600px] mb-4">
          <Image
            src={post.featuredImageCollection.items[0].url}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t"
          />
        </div>
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {post.content}
      </ReactMarkdown>
    </div>
  );
}
