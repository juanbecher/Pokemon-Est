
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import styled from "@emotion/styled";
import React,{useEffect, useState} from "react";
import { css, cx } from "@emotion/css";

const ArrowContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 12%;
  
  .hidden{
    display: none;
  }
  .show{
    display: block;
  }

  :hover{
    cursor: pointer;
  }
`;



const ScrollTop = () => {

    const [show, setShow] = useState(false)

    useEffect(() => {
      window.addEventListener("scroll", handleScroll)
      
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])
    
    const handleScroll = () => {
      console.log(window.scrollY)
      if(window.pageYOffset > 300){
        setShow(true)
      }
      else{
        setShow(false)
      }
    }

    const ScrollToTop = () => {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }

    return(
      <ArrowContainer >
        <ArrowUpwardIcon className={show ? "show" : "hidden"} onClick={ScrollToTop} fontSize="large"/>
      </ArrowContainer>
    )
}

export default ScrollTop;