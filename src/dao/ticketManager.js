import { ticketModel } from './models/ticketModelo.js';

export class TicketManager {
  async create(obj) {
    try {
      const newTicket = await ticketModel.create(obj);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }
  async getTicketById(id) {
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        throw new Error(`Ticket with ID ${id} not found`);
      }
      return ticket;
    } catch (error) {
      console.error('Error getting ticket by ID:', error);
      throw error;
    }
  }
  async getAllTickets() {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      console.error('Error getting all tickets:', error);
      throw error;
    }
  }
  async updateTicketById(id, updateObj) {
    try {
      const updatedTicket = await ticketModel.findByIdAndUpdate(id, updateObj, {
        new: true,
      });
      if (!updatedTicket) {
        throw new Error(`Ticket with ID ${id} not found`);
      }
      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }
  async deleteTicketById(id) {
    try {
      const deletedTicket = await ticketModel.findByIdAndDelete(id);
      if (!deletedTicket) {
        throw new Error(`Ticket with ID ${id} not found`);
      }
      return deletedTicket;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }
}
