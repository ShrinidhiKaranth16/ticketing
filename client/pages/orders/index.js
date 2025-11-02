const OrdersIndex = ({ orders }) => {
    return <div>
        <h1>Orders</h1>
        <ul>
            {orders.map((order) => (
                <li key={order.id}>{order.ticket.title} - {order.status}</li>
            ))}
        </ul>
    </div>;
};

export default OrdersIndex;

OrdersIndex.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
};
