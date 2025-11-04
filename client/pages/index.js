import Link from "next/link";
import { useRouter } from "next/router";
const HomePage = ({ tickets }) => {

    const ticketList = tickets.map(ticket => {
        return <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>View</Link>
            </td>
        </tr>
    });
    return <div>
        <h2 className="text-lg font-bold">Tickets</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {ticketList}
            </tbody>
        </table>
    </div>
}

HomePage.getInitialProps = async (context,client,currentUser) => {
    const {data} = await client.get("/api/tickets");
    return {tickets:data};
}
export default HomePage;
