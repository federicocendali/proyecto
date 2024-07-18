const comprar = async (pid) => {
  let inputCarrito = document.getElementById('inputCarrito');
  let cid = inputCarrito.value;
  let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: 'post',
  });
  if (respuesta.status === 200) {
    let datos = await respuesta.json();
    console.log(datos);
    alert('Producto agregado...!!!');
  }
};
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
if (mensajeBienvenida) {
  setTimeout(() => {
    mensajeBienvenida.remove();
  }, 2000);
}
const eliminar = async (cid, pid) => {
  try {
    console.log(`Carrito ID: ${cid}, Producto ID: ${pid}`);
    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: 'DELETE',
    });
    if (respuesta.status === 200) {
      let datos = await respuesta.json();
      console.log(datos);
      alert('Producto eliminado con éxito.');
      window.location.reload();
    } else {
      console.error(
        'Error al eliminar el producto:',
        respuesta.status,
        respuesta.statusText
      );
      alert(
        `Hubo un error al eliminar el producto: ${respuesta.status} ${respuesta.statusText}`
      );
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    alert(`Hubo un error al procesar la solicitud: ${error.message}`);
  }
};
document.getElementById('logoutBtn').addEventListener('click', function () {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    fetch('http://localhost:8080/api/sessions/logout', {
      method: 'POST',
    })
      .then((response) => {
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
});
const finalizarCompra = async () => {
  console.log('finalizarCompra function called');
  let inputCarrito = document.getElementById('inputCarrito');
  if (!inputCarrito) {
    console.error('inputCarrito no encontrado');
    alert('No se pudo encontrar el inputCarrito.');
    return;
  }
  let cid = inputCarrito.value;
  console.log('Carrito ID:', cid);
  if (!cid) {
    alert('No se pudo obtener el ID del carrito.');
    return;
  }
  try {
    let respuesta = await fetch(`/api/carts/${cid}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (respuesta.ok) {
      let datos = await respuesta.json();
      console.log(datos);
      alert('Compra finalizada exitosamente!');
      window.location.href = '/';
    } else {
      console.error('Error en la respuesta:', respuesta.statusText);
      alert('Error al finalizar la compra. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    alert('Error inesperado al finalizar la compra. Inténtalo de nuevo.');
  }
};
