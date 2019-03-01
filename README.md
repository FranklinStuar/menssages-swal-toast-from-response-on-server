_Busca los mensajes que devuelve el servidor y los muestra en mensajes ya sean toast o swal. 
_Lo utilicé en Laravel con Axios, por lo que creo que debe funcionar con la mayoría
```
_axios.post(url-ajax-del-servidor, {
_   parametros-que-se-le-envian
_})
_.then(response => {
_    // respuesa-correcta-del-servidor
_    toast_message(error.response) 
_}, error => {
_    // error-del-servidor--en-este-caso-el-response-esta-dentro-de-error
_    swal_message(error.response)
_});
```