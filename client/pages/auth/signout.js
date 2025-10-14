import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const SignoutPage = () => {
    const {doRequest} = useRequest({
        url:'/api/users/signout',
        method:'post',
        onSuccess:()=>{
            Router.push('/');
        }
    });

    useEffect(() => {
        doRequest();
    }, []);
        
    return <div>Signing out...</div>;
}

export default SignoutPage;
