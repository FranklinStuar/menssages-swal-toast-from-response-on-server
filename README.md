_Busca los mensajes que devuelve el servidor y los muestra en mensajes ya sean toast o swal. 
_Lo utilicé en Laravel con Axios, por lo que creo que debe funcionar con la mayoría
```
axios.post(url-ajax-del-servidor, {
       parametros-que-se-le-envian
})
.then(response => {
        // respuesa-correcta-del-servidor
    toast_message(error.response) 
}, error => {
        // error-del-servidor--en-este-caso-el-response-esta-dentro-de-error
    swal_message(error.response)
});
```