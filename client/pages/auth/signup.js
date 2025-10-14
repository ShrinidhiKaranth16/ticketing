"use client";
import React from "react";
import { Form, Title, FormGroup, Label, Input, Button } from "./signup.styles";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const SignupPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest,errors} = useRequest({
        url:'/api/users/signup',
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
            <Title>Sign Up</Title>

            <FormGroup>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>

            <FormGroup>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            {errors}
            <Button type="submit">Sign Up</Button>
        </Form>
    );
};

export default SignupPage;
