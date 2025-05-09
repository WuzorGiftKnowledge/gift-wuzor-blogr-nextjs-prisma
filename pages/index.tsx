import React from "react"
import { GetServerSideProps } from 'next';
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
//import prisma from '../lib/prisma';


import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

type Props = {
  feed: PostProps[]
}
export const getServerSideProps: GetServerSideProps = async () => {
 //export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};



const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 ">Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post}  />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
