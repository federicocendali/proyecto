import { TicketManager } from '../dao/ticketManager.js';

class TicketService {
  constructor(dao) {
    this.dao = dao;
  }
  create = async (obj) => {
    let resultado = await this.dao.create(obj);
    return resultado;
  };
  getTicketById = async (id) => {
    let resultado = await this.dao.getById(id);
    return resultado;
  };
  getAllTickets = async () => {
    let resultado = await this.dao.getAll();
    return resultado;
  };
  updateTicketById = async (id, updateObj) => {
    let resultado = await this.dao.updateById(id, updateObj);
    return resultado;
  };
  deleteTicketById = async (id) => {
    let resultado = await this.dao.deleteById(id);
    return resultado;
  };
}

export const ticketService = new TicketService(new TicketManager());
