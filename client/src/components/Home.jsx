/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

const Home = () => {
  let navigate = useNavigate();
  let token = localStorage.getItem('token');

  useEffect(() => {
    const getUser = async() =>{
      if(!token){
        return navigate("/login");
      } else {
        const res = await fetch('http://localhost:3000/api/auth/sign-in',{
          method:"post",
          headers:{
            "content-type":"application/json",
            "token":token
          }
        })
        if(!res){
          return navigate("/login");
        }
        const result= await res.json()
        console.log(result);
      }
    }
    getUser()
  }, [token])
  
  return (
    <div>
      <Header/>
    </div>
  )
}

export default Home