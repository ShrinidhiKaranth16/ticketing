import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  if (!ticket) {
    return <div className="container mt-5">Loading ticket...</div>;
  }

  const {doRequest,errors} = useRequest({
    url:'/api/orders',
    method:'post',
    body:{ticketId:ticket.id},
    onSuccess:(order)=>{
        Router.push("/orders/[orderId]",`/orders/${order.id}`);
    }
  });
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm" style={{ width: "400px" }}>
        <div className="card-body">
          <h2 className="card-title mb-3">{ticket.title}</h2>
          <h4 className="card-subtitle mb-4 text-muted">${ticket.price.toFixed(2)}</h4>
          {errors}
          <button onClick={() => doRequest()} className="btn btn-primary w-100">Purchase</button>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
  return { ticket: data };
};

export default TicketShow;
