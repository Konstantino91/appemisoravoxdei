document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
	cordova.plugins.backgroundMode.setDefaults({ text:'La frecuencia de la Esperanza y la Paz.'});
	cordova.plugins.backgroundMode.enable();
	cordova.plugins.backgroundMode.onactivate = function () {
		// Modify the currently displayed notification
		cordova.plugins.backgroundMode.configure({
			text:'Emisora Vox Dei'
		});
	}

	cordova.plugins.backgroundMode.ondeactivate = function() {
		onResume();
	}
	mostrarPaginaInicio();
	desplegarNoticia(); /*Habilita las funciones de desplegar una de las 5 noticias mostradas dependiendo de la categoría*/
	$('#home').click(function(){
		mostrarPaginaInicio();
	});
	document.addEventListener("backbutton", onBackKeyDown, false); /*Activa la función del botón atrás*/
	document.addEventListener("online", onOnline, false);  /*Cuando se conecta a internet reinicia el audio*/
}

/*Variables*/
var titulos= new Array();
var imagenes= new Array();
var contenidos= new Array();
var enlaces= new Array();
var home= false;


/*Realiza un llamado a un metodo que carga las últimas noticias subidas en la página*/
function mostrarPaginaInicio(){
	$('#noticia').addClass('oculto');
	$('.compartir').addClass('oculto');
	cargarNoticias("http://www.emisoravoxdei.com/nuevoportal/appemisoravoxdei/xml/articulosg.xml");
}

/*Recibe un xml de noticias de alguna categoria y las carga en el contenido*/
function cargarNoticias(xml){
	borrarContenido();
	mostrarNoticias();
	var i=1;
	var titulo= null;
	var contenido = null;
	var imagen = null;
	var enlace=null;
	titulos.length=0;
	imagenes.length=0;
	contenidos.length=0;
	enlaces.length=0;
	$.get(xml,{},function(xml){ //Abrimos el archivo articulosg.xml
			//El ciclo se va repetir cada vez que se encuentre la etiqueta articulo
		$('Articulo',xml).each(function() {
		  titulo = $(this).find('titulo').text(); //buscamos el valor que contiene la etiqueta titulo y lo guardamos en la variable titulo
		  contenido = $(this).find('contenido').text(); //lo mismo con texto
		  imagen = $(this).find('imagen').text();
		  imagen= validarImagen(imagen);
		  enlace= $(this).find('enlace').text();
		  $('#a'+i).append("<h2> "+titulo+" </h2>");
		  $('#a'+i).append(imagen);
		  titulos.push(titulo);
		  imagenes.push(imagen);
		  contenidos.push(contenido);
		  enlaces.push(enlace);
		  i++;
	  	}); //final de leer cada etiqueta noticia
	}); //fin de $.get
}

/*Borra el contenido de todas las noticias*/
function borrarContenido(){
	$('#a1').empty();
	$('#a2').empty();
	$('#a3').empty();
	$('#a4').empty();
	$('#a5').empty();
	$('#noticia').empty();
	window.scrollTo(0,0);
}

/*Muestras las últimas noticias cargadas en la app*/
function mostrarNoticias(){
	$('#a1').show();
	$('#a2').show();
	$('#a3').show();
	$('#a4').show();
	$('#a5').show();
	$('#noticia').empty();
	window.scrollTo(0,0);
}

/*Agrega la url de la página a la imagen para poderla cargar*/
function validarImagen(imagen){
	if(imagen.indexOf("images")==10){
		imagen = imagen.replace("images","http://www.periodicolaverdad.com/home/images");
	}
	return imagen;
}

/*Realiza el llamado a un metodo que despliega la noticia dependiendo de cuál se haya elegido */
function desplegarNoticia(){
	$('#a1').click(function(){
		mostraNoticia(0, '#a2', '#a3', '#a4', '#a5');
	});

	$('#a2').click(function(){
		mostraNoticia(1, '#a1', '#a3', '#a4', '#a5');
	});

	$('#a3').click(function(){
		mostraNoticia(2, '#a1', '#a2', '#a4', '#a5');
	});

	$('#a4').click(function(){
		mostraNoticia(3, '#a1', '#a2', '#a3', '#a5');
	});

	$('#a5').click(function(){
		mostraNoticia(4, '#a1', '#a2', '#a3', '#a4');
	});
}

/*Despliega en el contenido una noticia*/
function mostraNoticia(indice, noticia1, noticia2, noticia3, noticia4){
	var ind= indice+1;
	$('#a'+ind).hide();
	$(noticia1).hide();
	$(noticia2).hide();
	$(noticia3).hide();
	$(noticia4).hide();
	home=false;
	$('#noticia').append('<h2>'+titulos[indice]+'</h2>');
	$('header').append('<div id="share'+ ind + '"></div>');
	$('#noticia').append(imagenes[indice]);
	$('#noticia').append(contenidos[indice]);
	$('#noticia').removeClass('oculto');
	$('#share'+ind).addClass('compartir');
	$('#share'+ind).removeClass('oculto');
	window.scrollTo(0,0);
	compartir();
}

/*Activa la función para compartir noticias en redes sociales*/
function compartir(){
	$('#share1').click(function(){
		window.plugins.socialsharing.share(titulos[0]+' </br> '+enlaces[0]);
	});

	$('#share2').click(function(){
		window.plugins.socialsharing.share(titulos[1]+' </br> '+enlaces[1]);
	});

	$('#share3').click(function(){
		window.plugins.socialsharing.share(titulos[2]+' </br> '+enlaces[2]);
	});

	$('#share4').click(function(){
		window.plugins.socialsharing.share(titulos[3]+' </br> '+enlaces[3]);
	});

	$('#share5').click(function(){
		window.plugins.socialsharing.share(titulos[4]+' </br> '+enlaces[4]);
	});

	$('a').click(function(){
		document.removeEventListener("backbutton", onBackKeyDown);
	});
}


/*Función del boton 'atrás'*/
function onBackKeyDown() {
	if(!home){
		home= true;
		mostrarPaginaInicio();
	}else{
		navigator.app.exitApp();
	}
}


function onResume() {
	$('.reproductor').empty();
	$('.reproductor').append("<audio id='senial' controls='controls' autoplay='yes'>"
		+"<source src='http://200.114.30.246:8000/;stream.mp3' type='audio/mpeg'>"
	+"</audio>");
}

function onOnline() {
	onResume();
}
