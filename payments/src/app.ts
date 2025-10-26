import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { errorHandler, currentUser } from '@retix/common';
import { createChargeRouter } from './routes/new';
import { NotFoundError } from '@retix/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !== 'test'    
}));

app.use(currentUser);
app.use(createChargeRouter);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

export { app };
