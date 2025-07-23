/*
Gulp Configuración:
1. import { src, dest, watch, series } from 'gulp';
Se importan funciones nativas de Gulp:
  -src: para leer archivos de origen (por ejemplo, los .scss).
  -dest: para escribir archivos compilados (por ejemplo, el .css generado).
  -watch: para estar atento a cambios en archivos y ejecutar tareas automáticamente.
  -series: para correr tareas en orden secuencial.

2. import gulpSass from 'gulp-sass'
Importa el plugin gulp-sass, que conecta Gulp con el compilador Sass.
  -No compila directamente, necesita un compilador Sass para funcionar 
  (por eso se le pasa dartSass).

3. import * as dartSass from 'sass';
Importa todo lo que exporta el paquete sass (que en realidad es el compilador Dart Sass).
  -Dart Sass es el compilador oficial recomendado por el equipo de Sass desde hace varios años.

4. const sass = gulpSass(dartSass);
Aquí se le indica a gulp-sass que use como compilador a Dart Sass.
  -Esta es la forma recomendada desde que gulp-sass dejó de incluir su propio compilador.
¨
*quietDeps: Silencia notificaciones/advertencias de dependencias, en este caso Bootstrap.
¿Qué significan estos warnings?
  -Bootstrap 5 (especialmente desde v5.3) usa funciones como red(), green(), blue(), 
  mix(), color.adjust(), etc.
  -Esas funciones han sido marcadas como obsoletas (deprecated) por DartSass y 
  te recomiendan usar la API nueva: color.channel(), color.mix(), etc.
  -El warning sugiere que en el futuro podrían dejar de funcionar, pero por ahora 
  no pasa nada, todo sigue funcionando.
*/
import { src, dest, watch, series } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import purgecss from 'gulp-purgecss';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);

//Tarea para compilar Sass
export function compilarSass() {
    return src('src/scss/**/*.scss') //Ruta del archivo principal
        .pipe( sass({ quietDeps: true }).on('error', sass.logError) ) //Compilando SASS
        .pipe( dest('build/css') ); //Carpeta de salida
}

//Tare Build
export function cssbuild() {
  return src('build/css/app.css')
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(purgecss({
      content: ['index.html']
    }))
    .pipe(dest('build/css'))
}

//Tarea para observar cambios
export function watcher() {
  watch('src/scss/**/*.scss', compilarSass);
}

//Tareas secuenciales
export default series(compilarSass, cssbuild);

/*
Ejecución
1. npx gulp compilarSass
2. npx gulp watcher
3. gulp -> default
*/
