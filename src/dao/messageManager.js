import messageModel from './models/messages.model.js';

export default class MessageManager {
  getMessages = async () => {
    try {
      return await messageModel.find().lean();
    } catch (err) {
      return err;
    }
  };
  createMessage = async (m) => {
    if (m.user.trim() === '' || m.message.trim() === '') {
      return null;
    }
    try {
      return await messageModel.create(m);
    } catch (err) {
      return err;
    }
  };
  deleteMessage = async () => {
    try {
      console.log('borrando mensajes...');
      const result = await messageModel.deleteMany({});
      console.log('mensaje borrado', result);
      return result;
    } catch (err) {
      console.log('error al borrar mensaje', err);
      return err;
    }
  };
}
