"use client";
import { fetchAllTickets } from "@/api/TicketApi";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        const response = await fetchAllTickets();
        setTickets(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketsData();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created By</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Ticket Title</TableHead>
            <TableHead>Ticket Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.created_by}</TableCell>
                <TableCell>{ticket.created_date}</TableCell>
                <TableCell>{ticket.ticket_title}</TableCell>
                <TableCell>{ticket.ticket_description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableHeader>
      </Table>
    </div>
  );
};

export default Ticket;
