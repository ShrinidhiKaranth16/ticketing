import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { errorHandler, currentUser } from '@retix/common';
import { NotFoundError } from '@retix/common';
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !== 'test'    
}));

app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

export { app };
