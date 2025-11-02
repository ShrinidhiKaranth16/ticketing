"use client";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Link from "next/link";

const NewTicket = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        onSuccess: () => {
            Router.push('/');
        },
    });
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    };
    return (
        <div className="container mt-4">
            <h1>Create New Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        className="form-control"
                        id="price"
                        onBlur={onBlur}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors && <div className="alert alert-danger">{errors || "Something went wrong"}</div>}
                <button type="submit" className="btn btn-primary mt-4">
                    Submit
                </button>
            </form>
            <Link href="/">Back to Home</Link>
        </div>
    );
};

export default NewTicket;
