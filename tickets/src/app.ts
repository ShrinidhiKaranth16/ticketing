import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexRouter } from './routes/index';
import { errorHandler, currentUser } from '@retix/common';
import { NotFoundError } from '@retix/common';
import cookieSession from 'cookie-session';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: false    
}));

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateTicketRouter);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

export { app };
