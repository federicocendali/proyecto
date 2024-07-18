import { ticketService } from '../services/TicketService.js';

export const createTicket = async (req, res) => {
  try {
    const ticketData = req.body;
    const newTicket = await ticketService.createTicket(ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.getTicketById(ticketId);
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(404).json({ message: 'Ticket not found' });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ message: 'Error getting tickets' });
  }
};

export const updateTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updateData = req.body;
    const updatedTicket = await ticketService.updateTicketById(
      ticketId,
      updateData
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(404).json({ message: 'Ticket not found' });
  }
};

export const deleteTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await ticketService.deleteTicketById(ticketId);
    res.status(200).json(deletedTicket);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(404).json({ message: 'Ticket not found' });
  }
};
