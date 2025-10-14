"use client";
import React from "react";
import { Form, Title, FormGroup, Label, Input, Button } from "./signup.styles";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const SigninPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest,errors} = useRequest({
        url:'/api/users/signin',
        method:'post',   
        body:{email,password},
        onSuccess:()=>{
            Router.push('/');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }   

    return (

        <Form onSubmit={handleSubmit}>
            <Title>Sign In</Title>

            <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>

            <FormGroup>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            {errors}
            <Button type="submit">Sign In</Button>
        </Form>
    );
};

export default SigninPage;
