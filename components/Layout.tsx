import Link from "next/link";
import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import { css, cx } from "@emotion/css";

const Nav = styled.nav`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    padding: 15px;
    border-bottom: 1px solid white;
    :hover {
      background-color: #0f63d0;
      transition: 1s;
    }
  }
  .selected {
    background-color: #1976d2;
  }
`;
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Nav>
        <Link href={"/"}>
          <a className={router.pathname == "/" ? "selected" : ""}>Home</a>
        </Link>
        <Link href={"/results"}>
          <a className={router.pathname == "/results" ? "selected" : ""}>
            Result
          </a>
        </Link>
      </Nav>
      {router.pathname == "/" && <div
        className={css`
            position: fixed;
            right: 5%;
            bottom: 50px;
        `}
      >
        <a href="https://github.com/juanbecher/Pokemon-Est" target="_blank" rel="noreferrer">
        <svg stroke="currentColor" fill="currentColor" viewBox="0 0 1024 1024" color="white" height="32" width="32" xmlns="http://www.w3.org/2000/svg" ><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>
        </a>
      </div>}
      
      <main>{children}</main>
    </>
  );
};

export default Layout;
