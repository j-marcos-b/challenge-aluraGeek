document.getElementById('commentForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Obtén los valores de los campos
    const name = document.getElementById('exampleInputName').value;
    const email = document.getElementById('exampleInputEmail1').value;
    const message = document.getElementById('exampleTextarea').value;

    // Crea un objeto con los datos del comentario
    const newComment = {
        name: name,
        email: email,
        message: message
    };

    // Realiza la solicitud POST usando fetch
    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        console.log('Comentario guardado:', data);
        // Aquí puedes agregar un mensaje o limpiar el formulario si lo deseas
        alert('Comentario enviado con éxito');
        document.getElementById('commentForm').reset(); // Limpia el formulario
    })
    .catch(error => {
        console.error('Error al enviar el comentario:', error);
        alert('Hubo un problema al enviar el comentario');
    });
});