import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <Header />
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {props.children}
    </main>
  </div>
);

export default Layout;
