import React, {useRef} from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import {prisma} from '../../lib/prisma';
import { toPng } from 'html-to-image';

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

const Post: React.FC<PostProps> = (props) => {
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
  
      const dataUrl = await toPng(postRef.current, {
        width: 400, // Set width to 1080px
        height: 400, // Set height to 1080px
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
      <div>
        <div ref={postRef} style={{ color: 'black', backgroundColor: 'white', padding: '2rem' }}>
          <h2>{title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          <ReactMarkdown source={props.content} />
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

export default Post;