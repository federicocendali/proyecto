import ProductManager from '../dao/productManagerMONGO.js';
const productManager = new ProductManager();

const socketProducts = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    const listOfProducts = await productManager.getProducts();

    socketServer.emit('sendProducts', listOfProducts);

    socket.on('addProduct', async (obj) => {
      await productManager.addProduct(obj);
      const listOfProducts = await productManager.getProducts();
      socketServer.emit('sendProducts', listOfProducts);
    });

    socket.on('deleteProduct', async (id) => {
      console.log('Solicitud para eliminar el producto con ID:', id);
      await productManager.deleteProductById(id);
      const listOfProducts = await roductManager.getProducts();
      socketServer.emit('sendProducts', listOfProducts);
    });
  });
};

export default socketProducts;
