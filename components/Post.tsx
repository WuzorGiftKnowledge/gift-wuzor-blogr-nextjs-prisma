import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div className= "w-70 mb-10 mx-4 my-10 pt-4" onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      
      <h2 className="text-2xl font-mono">{post.title}</h2>
     
      <ReactMarkdown className="prose break-words whitespace-pre-wrap" source={post.content} />
    
      <div className="text-lg font-bold italic" >
       <small>-{authorName}</small>
       </div>
    </div>
  );
};

export default Post;
