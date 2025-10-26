import mongoose from "mongoose";
import { OrderStatus } from "@retix/common";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface OrderAttrs {
    id: string;
    version: number;
    price: number;
    userId: string;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderAttrs> {
    build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    price: number;
    userId: string;
    status: OrderStatus;
}

const orderSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
