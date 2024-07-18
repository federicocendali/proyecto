import os from 'os';
export function argumentosProduct(product) {
  let { title, description, price, ...otros } = product;
  return `Se han detectado argumentos inválidos:
Argumentos obligatorios:
    - title: tipo String. Se recibió: ${title}
    - description: tipo String. Se recibió: ${description}
    - price: tipo Number. Se recibió: ${price}
Argumentos opcionales:
    - stock, thumbnail, code, category, status. Se recibió: ${JSON.stringify(
      otros
    )}
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}

export function tituloObligatorioProduct(product) {
  let { title } = product;
  return `Título es requerido no puede ser vacio:
    - title: tipo String. Se recibió: ${title}
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}

export function productoExistente(title) {
  title = typeof title === 'string' ? title : JSON.stringify(title);
  return `El producto con  "${title}" ya existe en la base de datos.
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}

export function errorInesperado(error) {
  return `Error inesperado en el servidor:
Mensaje: ${error.message}
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}

export function argumentosRepetidosProduct(product) {
  let { title, description, price, code, ...otros } = product;
  return `Se han detectado argumentos repetidos de manera exacta eso es inválido:
Argumentos obligatorios:
    - title: ${title},
    - description:  ${description}
    - price: ${price}
Otros argumentos opcionales:
    - stock, thumbnail, code, category, status. Se recibió: ${JSON.stringify(
      otros
    )}
    verificar campos por favor
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`;
}
