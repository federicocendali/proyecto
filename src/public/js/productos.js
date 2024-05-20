const comprar = async (pid) => {
  let inputCarrito = document.getElementById('inputCarrito');
  let cid = inputCarrito.value;
  let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: 'post',
  });
  if (respuesta.status === 200) {
    let datos = await respuesta.json();
    console.log(datos);
    alert('Producto agregado.');
  }
};
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
if (mensajeBienvenida) {
  setTimeout(() => {
    mensajeBienvenida.remove();
  }, 4000);
}
