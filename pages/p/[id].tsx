import React, {useRef} from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import {prisma} from '../../lib/prisma';
import { toPng } from 'html-to-image';
import Post from '../../components/Post';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};
let url=process.env.NEXT_PUBLIC_LURL;
async function publishPost(id: number): Promise<void> {
  url=`${url}api/publish/${id}`;
  await fetch(url, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: number): Promise<void> {
  url=`${url}/api/post/${id}`;
  await fetch(url, {
    method: 'DELETE',
  });
  Router.push('/');
}

const GetPost: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const postRef = useRef<HTMLDivElement>(null);

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const downloadPostAsImage = async () => {
    if (postRef.current) {
      // Ensure the post content has the desired styles
      postRef.current.style.backgroundColor = 'black';
      postRef.current.style.color = 'white';
      postRef.current.style.overflow = "visible"; // Ensure no content is clipped
    postRef.current.style.padding = "0"; // Remove padding
    postRef.current.style.margin = "0"
  console.log(postRef.current.scrollWidth, postRef.current.scrollHeight);
      const dataUrl = await toPng(postRef.current, {
        width: postRef.current.scrollWidth, // Match the width of the div
        height: postRef.current.scrollHeight+100, // Match the height of the div
      });
  
      // Revert styles after generating the image
      postRef.current.style.backgroundColor = '';
      postRef.current.style.color = '';
  
      const link = document.createElement('a');
      link.download = `${props.title}.png`;
      link.href = dataUrl;
      link.click();
    }
  };


  return (
    <Layout>
      <div className="w-100 max-w-xl mx-2 bg-white p-4">
       
        <div  ref={postRef}>
        <Post post={props} />
        </div>

        <button onClick={downloadPostAsImage}>Download as PNG</button>
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default GetPost;