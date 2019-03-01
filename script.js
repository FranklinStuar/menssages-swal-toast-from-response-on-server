/**
 * Recibe el response que llega desde el servidor y lo busca entre diferentes maneras 
 * 
 * @param {objet,string} response recibe el response del servidor y busca el mensaje
 * @param {string} type success, error
 */
function getMessageResponse(response,type=null){
    textResponse = 'Error interno. Pruebelo nuevamente o comuníquese con un técnico'
    // supone que el reponse viene ya establecido como texto, (puede quitar esta validación y hacer todo el proceso que sigue)
    if(type!=null)
        return response
    // Si no hay un tipo en específico, busca entre el data que sabe vernir dentro del response para buscar el mensaje (response.data)
    else if(response.data!=null){
        if(response.data.message)
            textResponse = response.data.message
        else if(response.data.messaje)
            textResponse = response.data.messaje
        else if(response.data.mensaje)
            textResponse = response.data.mensaje
        else if(response.data.error)
            textResponse = response.data.error
        else
            textResponse = response.data
    }
    else //En caso que el mensaje se directo (por lo general, no debería funcionar)
        textResponse = reponse

    // Verifica que el mensaje sea el completo y no esté entre algún tipo de objeto, buscando "message" como retorno
    if(typeof(textResponse)=='object'){
        if('keys',Object.keys(textResponse).indexOf('message')!= -1)
            textResponse = textResponse.message
        else
            textResponse = ""
    }
    // verifica que el response hasta ahora no sea un array con message
    if(Array.isArray(textResponse) && textResponse.indexOf('message') != -1)
        textResponse = textResponse['message']
    // Si todo no ha devuelto algún tipo de mensaje, se asume que es un error y se muestra un mensaje predeterminado
    if(!textResponse || textResponse=='')
        textResponse = "Problemas internos. Estamos trabajando duro para solucionarlo pronto"
    // return del mensaje
    return textResponse
}
/**
 * Busca entre el response regresado del servidor, si hay mensajes de error y los lista 
 * @param {array,object,string} response |Mensaje de error en caso de haberlo
 */
function getErrorsResponse(response){
    // Sólo recibe objeto para verificar, caso contrario devuelve en vacío
    if(typeof(response)!='object')
        return ""
    textError = ''
    // Lista los errores
    if(Object.keys(response.data).indexOf('errors')!= -1){
        errors = response.data.errors //pasa a una variable más simple
        if(typeof(errors)=='object')
            // errores de validate
            if('keys',Object.keys(errors).indexOf('type')!= -1)
                errors = errors.type

        textError = "<hr><ul>"
        // Lista los errores si está en arrays, apropiado para las validaciones
        for (let i = 0; i < errors.length; i++) 
            textError += "<li>"+errors[i]+"</li>"            
        textError += "</ul>"
    }
    if(response.data.error)
        textError += "<ul><li>"+response.data.error+"</li></ul>"
    // retorna mensaje de errores
    return textError 
}

/**
 * Devuelve un swal simple con el mensaje del que llega del servidor, 
 * ya sea un mensaje válido o un mensaje de error 400 o 500
 * 
 * @param {object} response el mensaje a mostrar ya sea en object o directo
 * @param {number,string} type 200,400,500 - success, error
 * @param {cabecera del mensaje} head | indica si el mensaje tiene una cabecera para mostrar, si no lo tiene se declara algún mensaje por defecto
 */
function swal_message(response,type=null,head=null){
    // estabiliza los mensajes por números, si vienen en letras que sean en ingles, si type es nulo busca del response, caso contrario, error del sistema (500)
    status = (type && type=='success')?200:(type && type=='error')?400:(response.status)?response.status:500
    textResponse = getMessageResponse(response,type)
    
    // ok (200)
    if(status >= 200 && status < 300)
        swal(
            (head)?head:'¡Éxito!',
            textResponse,
            'success',
        )
    // error (500) error del sistema, mensaje directo para no mostrar al usuario el verdadero mensaje
    else if(status >= 500 && status < 600)
        swal(
            (head)?head:'¡Error Interno!',
            "Hemos cometido un error. Lo estamos solucionando lo más pronto",
            'error',
        )
    // error (400) response con mensajes de error dentro del sistema
    else{
        textError = ""
        if(status >= 400 && status < 500)
            textError = getErrorsResponse(response)
        swal(
            (head)?head:'Error',
            textResponse+'<br>'+textError,
            'error',
        )
    }
	
}

/**
 * Muestr el mensaje usando toastmessage de jquery con mensaje desde el servidor o mensaje directo desde cualquier lado
 * @param {object,string} response Mensaje a mostrar, ya sea un string o un objeto del servidor
 * @param {string} type success, error, notice, warning
 * @param {boolean} sticky si se cierra solo o no
 * @param {number} stayTime tiempo en segundos en lo que se cerraría el mensaje
 */
function toast_message(response,type=null,sticky = true,stayTime = 1){
    stayTime *=1000 //ingresa en segundos y lo transformo en milisegundos
    
    // mensajes que no son de error o de ok
    if(type && type != 'success' && type != 'error'){
        $().toastmessage('showToast', {
			text     : response,
			stayTime : stayTime,
			sticky   : sticky,
			type     : type
		});
    }
    else{
        // transforma el type en número para responser a los mensajes
        status = (type && type=='success')?200:(type && type=='error')?400:response.status
        // Obtiene en texto el mensaje
        textResponse = getMessageResponse(response,type) 
        // imprime mensaje 200
        if(status >= 200 && status < 300)
            $().toastmessage('showToast', {
                text     : textResponse,
                stayTime : stayTime,
                sticky   : sticky,
                type     : 'success'
            });
        // Imprime error del sistema, mensaje preestablecido para ocultar el verdadero error del sietema
        else if(status >= 500 && status < 600)
            $().toastmessage('showToast', {
                text     : "Hemos cometido un error. Lo estamos solucionando lo más pronto.",
                stayTime : stayTime,
                sticky   : sticky,
                type     : 'error'
            });
        // Error 400, con mensaje personalizado
        else{
            textError = ""
            if(status >= 400 && status < 500)
                textError = getErrorsResponse(response)
            $().toastmessage('showToast', {
                text     : textResponse+"</br>"+textError, //busca la lista de errores en especial los de validaciones
                stayTime : stayTime,
                sticky   : sticky,
                type     : 'error'
            });
        }
    }
}
