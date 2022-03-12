/**
 * Función principal.
 */
function main() {
  //jQuery CSS.
  $('.contenedor').css({
    'display': 'flex',
    'flex-direction': 'row',
    'flex-wrap': 'wrap',
    'justify-content': 'space-evenly'
  })
  $('.heroe #nivel, .heroe #salud, .heroe #experiencia, .heroe h3').css({
    'font-size': '20px',
    'color': 'blue',
    'text-align': 'center'
  })
  $('.enemigo #nivel, .enemigo #salud, .enemigo h3').css({
    'font-size': '16px',
    'color': 'red',
  })
  $('.enemigo').css({
    'border': '4px solid black'
  })

  //Saludo.
  salida('Bienvenido al juego.')

  //Variables y disparadores.
  var nombreHeroe
  var heroe
  var enemigo
  var experiencia_ganada
  var continuar
  var boton_atacar = document.getElementById('atacar')
  var boton_defenderse = document.getElementById('defenderse')
  var radio_fuente = document.getElementsByClassName('tamTexto')
  var cuerpo = document.getElementById('cuerpo')
  var tamFuente = localStorage.getItem('tamFuente')
  var nombre_heroe_id = document.getElementById('nombre_heroe')
  var radio_color = document.getElementsByClassName('colorheroe')
  var radio_color_fondo = document.getElementsByClassName('colorfondoheroe')
  var tipoColor = localStorage.getItem('tipoColor')
  var fondoColor = localStorage.getItem('fondoColor')
  var anotaciones = document.getElementById('anotaciones')
  var nota_escrita = localStorage.getItem('nota')
  var nicknameStorage = localStorage.getItem('nickname')
  var boton_clear = document.getElementById('clear')
  var checkbox_italic = document.getElementById('italic')
  var checkbox_bolder = document.getElementById('bolder')
  var italic = localStorage.getItem('italicFont')
  var bolder = localStorage.getItem('bolderFont')
  //Comprobar nickname.
  if (nicknameStorage != null) {
    swapHeroe = entrada('¿Desea recuperar la partida? En caso contrario, los datos se reiniciarán.')
    if (swapHeroe == 'Si' || swapHeroe == 'si') {
      loadData()
    } else {
      localStorage.clear()
      nombreHeroe = entrada('Introduce el nombre de tu héroe.')
      heroe = new Heroe(nombreHeroe, 100, 2500, 1, 0, 10, false)
      localStorage.setItem('nickname', nombreHeroe)
    }
  } else {
    nombreHeroe = entrada('Introduce el nombre de tu héroe.')
    heroe = new Heroe(nombreHeroe, 100, 2500, 1, 0, 10, false)
    localStorage.setItem('nickname', nombreHeroe)
  }

  //Ejecución preload.
  preload()

  //Ejecución de las stats del héroe
  stats_heroe()

  //Ejecución spawn del enemigo.
  enemigo = spawn_enemigos()

  //Ejecución stats enemigo.
  stats_enemigo()

  //Event listener atacar.
  boton_atacar.addEventListener('click', (event) => {
    atacar()
  })

  //Event listener defenderse.
  boton_defenderse.addEventListener('click', (event) => {
    defender()
  })

  //Event listener cambiar texto.
  for (var i = 0; i < radio_fuente.length; i++) {
    radio_fuente[i].addEventListener('click', (event) => {
      cambiaTexto(event)
    })
  }

  //Event listener cambiar color.
  for (var i = 0; i < radio_color.length; i++) {
    radio_color[i].addEventListener('click', (event) => {
      cambiaColor(event)
    })
  }

  //Event listener cambiar color fondo.
  for (var i = 0; i < radio_color_fondo.length; i++) {
    radio_color_fondo[i].addEventListener('click', (event) => {
      cambiaColorFondo(event)
    })
  }

  //Event listener para interactuar con el textarea.
  anotaciones.addEventListener('input', (event) => {
    guardarAnotaciones(event)
  })

  //Event listener para vacíar la caché.
  boton_clear.addEventListener('click', () => {
    localStorage.clear()
  })

  //Event listener para cursiva.
  checkbox_italic.addEventListener('click', (event) => {
    cambioItalic(event)
  })

  //Event listener para negrita.
  checkbox_bolder.addEventListener('click', (event) => {
    cambioBolder(event)
  })

  //Función stats heroe.
  function stats_heroe() {
    $('.heroe #nivel').html(heroe.getNivel)
    $('.heroe #experiencia').html(heroe.getExperiencia)
    $('.heroe #salud').html(heroe.getVida + '/' + heroe.getVida)
    $('.heroe #defensa').html(heroe.getDefensa)
    $('.heroe #ataque').html(heroe.getAtaque)
    document.getElementById('nombre_heroe').innerHTML = heroe.getNombre
  }

  //Función stats enemigo.
  function stats_enemigo() {
    $('.enemigo #nivel').html(enemigo.getNivel)
    $('.enemigo #salud').html(enemigo.getVida + '/' + enemigo.getVida)
    $('.enemigo #defensa').html(enemigo.getDefensa)
    $('.enemigo #ataque').html(enemigo.getAtaque)
    document.getElementById('nombre_enemigo').innerHTML = enemigo.getNombre
    document.getElementsByTagName('img')[0].src = enemigo.getImg
  }

  //Función que ejecuta el proceso de ataque del heroe.
  function atacar() {
    var isDead
    heroe.setIsDefendiendo = false
    $('.textdisplay').html('¡¡¡' + heroe.getNombre + '(' + heroe.getNivel + ')' + ' ataca a ' + enemigo.getNombre + '(' + enemigo.getNivel + ')!!!')
    enemigo.setVida = enemigo.receiveDmg(heroe.getAtaque)
    $('.enemigo #salud').html(enemigo.getVida + '/' + enemigo.getVida)
    $('.heroe #experiencia').html(heroe.getExperiencia)

    //Comprobamos muerte del enemigo.
    isDead = comprobar_muerte()

    if (!isDead) {
      setTimeout(recibir, 200)
    }
    saveData()
  }

  //Función que ejecuta el proceso de defensa del heroe.
  function defender() {
    var isDead
    $('.textdisplay').html('¡¡¡' + heroe.getNombre + '(' + heroe.getNivel + ')' + ' se defiende!!!')
    heroe.setIsDefendiendo = true

    /*Comprobamos muerte del enemigo. No es estrictamente necesario por el momento,
    pero puede ser útil en futuras expansiones.*/
    isDead = comprobar_muerte()

    if (!isDead) {
      setTimeout(recibir, 1000)
    }
    saveData()
  }

  //Función que ejecuta el contraataque del enemigo.
  function recibir() {
    $('.textdisplay').html('¡¡¡' + enemigo.getNombre + '(' + enemigo.getNivel + ')' + ' ataca a ' + heroe.getNombre + '(' + heroe.getNivel + ')!!!')
    heroe.setVida = heroe.receiveDmg(enemigo.getAtaque)
    $('.heroe #salud').html(heroe.getVida + '/' + heroe.getVida)
    setTimeout(comprobar_muerte, 500)
  }

  //Función de comprobación de muertes (x.x).
  function comprobar_muerte() {

    if (!heroe.stillAlive()) {
      $('.textdisplay').html('Ha ganado ' + enemigo.getNombre + '. ' + heroe.getNombre + ' ha muerto.\nGAME OVER.')
      $(".heroe").fadeOut(200)
      setTimeout(stats_enemigo, 500)
      continuar = entrada('¿Deseas empezar una nueva partida?')

      if (continuar == 'si') {
        nombreHeroe = entrada('Introduce el nombre de tu heroe.')
        heroe = new Heroe(nombreHeroe, 100, 25, 1, 0, 10, false)
        stats_heroe()
        enemigo = spawn_enemigos()
        $(".heroe").fadeIn(200)
        setTimeout(stats_enemigo, 100)
        $(".enemigo").fadeIn(200)
      } else {
        salida('Hasta luego.')
      }
      return true
    }

    if (!enemigo.stillAlive()) {
      $('.textdisplay').html('Ha ganado ' + heroe.getNombre + '.')
      experiencia_ganada = enemigo.expDrop(heroe.getNivel)
      heroe.levelUp(experiencia_ganada)
      $(".enemigo").fadeOut(200)
      enemigo = spawn_enemigos()
      setTimeout(stats_enemigo, 500)
      $(".enemigo").fadeIn(800)
      $('.textdisplay').html(enemigo.getNombre + ' ha aparecido.')
      return true
    }

  }

  //Función de cambiar texto.
  function cambiaTexto(event) {
    cuerpo.style.fontSize = event.currentTarget.value
    console.log(event.currentTarget.value)
    localStorage.setItem('tamFuente', event.currentTarget.value)
  }

  //Función de cambiar color.
  function cambiaColor(event) {
    nombre_heroe_id.style.color = event.currentTarget.value
    console.log(event.currentTarget.value)
    localStorage.setItem('tipoColor', event.currentTarget.value)
  }

  //Función de guardar las notas.
  function guardarAnotaciones(event) {
    console.log(event.currentTarget.value)
    localStorage.setItem('nota', event.currentTarget.value)
  }

  //Función de cambiar color fonde de héroe.
  function cambiaColorFondo(event) {
    nombre_heroe_id.style.backgroundColor = event.currentTarget.value
    console.log(event.currentTarget.value)
    localStorage.setItem('fondoColor', event.currentTarget.value)
  }

  //Función cambiar cursiva.
  function cambioItalic(event) {
    if (checkbox_italic.checked) {
      cuerpo.style.fontStyle = event.currentTarget.value
      console.log(event.currentTarget.value)
      localStorage.setItem('italicFont', event.currentTarget.value)
    } else {
      cuerpo.style.fontStyle = 'normal'
      localStorage.setItem('italicFont', 'normal')
    }
  }

  //Función cambiar negrita.
  function cambioBolder(event) {
    if (checkbox_bolder.checked) {
      cuerpo.style.fontWeight = event.currentTarget.value
      console.log(event.currentTarget.value)
      localStorage.setItem('bolderFont', event.currentTarget.value)
    } else {
      cuerpo.style.fontWeight = 'normal'
      localStorage.setItem('bolderFont', 'normal')
    }
  }

  //Función preload.
  function preload() {
    cuerpo.style.fontSize = tamFuente
    for (var i = 0; i < radio_fuente.length; i++) {
      if (radio_fuente[i].value == tamFuente) {
        radio_fuente[i].checked = true
      } else {
        radio_fuente[i].checked = false
      }
    }

    nombre_heroe_id.style.color = tipoColor
    for (var i = 0; i < radio_color.length; i++) {
      if (radio_color[i].value == tipoColor) {
        radio_color[i].checked = true
      } else {
        radio_color[i].checked = false
      }
    }

    nombre_heroe_id.style.backgroundColor = fondoColor
    for (var i = 0; i < radio_color_fondo.length; i++) {
      if (radio_color_fondo[i].value == fondoColor) {
        radio_color_fondo[i].checked = true
      } else {
        radio_color_fondo[i].checked = false
      }
    }

    anotaciones.value = nota_escrita

    cuerpo.style.fontStyle = italic
    if (checkbox_italic.value == italic) {
      checkbox_italic.checked = true
    } else {
      checkbox_italic.checked = false
    }

    cuerpo.style.fontWeight = bolder
    if (checkbox_bolder.value == bolder) {
      checkbox_bolder.checked = true
    } else {
      checkbox_bolder.checked = false
    }
  }

  //Almacenamiento de la partida.
  function saveData() {
    //Info heroe.
    localStorage.setItem('nombreHeroe', heroe.getNombre)
    localStorage.setItem('vidaHeroe', heroe.getVida)
    localStorage.setItem('ataqueHeroe', heroe.getAtaque)
    localStorage.setItem('nivelHeroe', heroe.getNivel)
    localStorage.setItem('experienciaHeroe', heroe.getExperiencia)
    localStorage.setItem('defensaHeroe', heroe.getDefensa)
    localStorage.setItem('isDefendiendoHeroe', heroe.getIsDefendiendo)
    localStorage.setItem('imgHeroe', heroe.getImg)
    //Info enemigo.
    localStorage.setItem('nombreEnemigo', enemigo.getNombre)
    localStorage.setItem('vidaEnemigo', enemigo.getVida)
    localStorage.setItem('ataqueEnemigo', enemigo.getAtaque)
    localStorage.setItem('nivelEnemigo', enemigo.getNivel)
    localStorage.setItem('defensaEnemigo', enemigo.getDefensa)
    localStorage.setItem('isDefendiendoEnemigo', enemigo.getIsDefendiendo)
    localStorage.setItem('imgEnemigo', enemigo.getImg)
  }

  //Recuperar partida.
  function loadData() {
    //Info heroe.
    heroe = new Heroe(
      localStorage.getItem('nombreHeroe'),
      localStorage.getItem('vidaHeroe'),
      localStorage.getItem('ataqueHeroe'),
      localStorage.getItem('nivelHeroe'),
      localStorage.getItem('experienciaHeroe'),
      localStorage.getItem('defensaHeroe'),
      localStorage.getItem('isDefendiendoHeroe'),
      localStorage.getItem('imgHeroe')
    )
    //Info enemigo.
    enemigo = new Enemigo(
      localStorage.getItem('nombreEnemigo'),
      localStorage.getItem('vidaEnemigo'),
      localStorage.getItem('ataqueEnemigo'),
      localStorage.getItem('nivelEnemigo'),
      localStorage.getItem('defensaEnemigo'),
      localStorage.getItem('isDefendiendoEnemigo'),
      localStorage.getItem('imgEnemigo')
    )
  }

}
main()