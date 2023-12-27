import { useState } from 'react';
import PinInput from 'react-pin-input';
import {useNavigate} from "react-router-dom"


const ActivateUser = () => {
  const [value, setValue] = useState("")
  const [data, setData] = useState("")
const navigate = useNavigate()

  const handleVerify = async () => {
    const signupData = localStorage.getItem('signup').split(",");
    const token = signupData[2]
    if (token) {
      const res = await fetch('http://localhost:3000/api/auth/activate-user', {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ activationToken: token, activationCode: value })
      })
      const result = await res.json();
      console.log(result)
      setData(result.message)
      localStorage.removeItem("signup")
      localStorage.setItem("token", token)
      if(localStorage.getItem("token")){
        navigate("/")
      }
    }
    else {
      return console.log("Please login or signup")
    }
  }
  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Activate User</h1>
      <p>{data}</p>
      <PinInput
        length={4}
        initialValue=""
        secret
        secretDelay={200}
        onChange={(value) => { setValue(value) }}
        type="numeric"
        inputMode="number"
        style={{ padding: '10px', borderRadius: "10px" }}
        inputStyle={{ borderColor: 'red' }}
        inputFocusStyle={{ borderColor: 'blue' }}
        onComplete={(value) => { setValue(value) }}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
      />
      <button onClick={handleVerify} className="rounded-xl bg-gray-100 px-5 py-3 text-base font-medium text-navy-700 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">Verify Code</button>
      
    </div>
  )
}

export default ActivateUser