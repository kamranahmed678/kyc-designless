import { useEffect,useContext, useState } from "react";
import { doKyc } from "../services/user";
import UserContext from "../store/AuthContext";

const DoKyc=({logOutBtnHandler})=>{

    const { userState:{email}} = useContext(UserContext)
    const [result,setResult]=useState('')

    useEffect(()=>{
        const getResult=async()=>{
            try{
                console.log(email)
                const resp=await doKyc(email)
                console.log(resp)
                setResult(resp.msg)
                if(resp){
                    setTimeout(() => {
                        logOutBtnHandler(resp.redirectUrl)
                    }, 1500);
                }
            }
            catch(e)
            {
                console.log(e)
            }
        }
        if (email)
        {getResult()}
    },[email])

    return(
        <h1>Doing Kyc: {result.length>0? result: 'Loading...'}</h1>
    )
}

export default DoKyc;