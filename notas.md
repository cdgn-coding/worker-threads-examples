# Paralelismo y concurrencia

[Importancia del paralelismo y concurrencia]

[Diferencias basicas entre ambas cosas]

[El desafío de Node.js por el EventLoop]

## Child process

* Es una de las formas más antíguas de hacer tareas intensivas de CPU
* Se basa en procesos del sistema operativo
* Puede usarse para ejecutar tareas distintas a scripts en Node
* Permite ejecutar otros procesos de Node y abstrae la comunicación interproceso (IPC).
* El proceso principal espera que los procesos hijos terminen, automáticamente.
* Es posible enviar paquetes y datagramas para ejecutar un servicio de red con múltiples procesos.

## Worker Threads

* Es una forma un poco más reciente que Child Process.
* Se basa en hilos del sistema operativo, por lo cual son más ligeros y recomendados si es posible usarlos.
* Se usa principalmente para ejecutar scripts de Node.
* Es posible comunicar hilos de forma bidireccional mediante canales de mensaje (MessageChannel)
* Es posible usarlo para procesar archivos, datos serializables, puertos de mensaje, entre otros tipos de datos.
* No es posible compartirle puertos de red.

## Cluster

* Es una variante de child process
* Permite ejecutar procesos trabajadores con Node con comunicación interprocesos (IPC)
* Facilita la ejecución de procesos que comparten puertos de red.

## Tradeoff Paralelismo y Concurrencia en Node

Ventajas

* Facilita la sincronización entre procesos e hilos
* Mantiene un estilo de código basado en eventos, propio del lenguaje.
* Abstrae gran parte de la complejidad de usar hilos y procesos del sistema operativo.

Desventajas

* La sintaxis para levantar procesos e hilos, no es tan sencilla. Para los child process, la sintaxis es más bien parecida a la de C.
* La forma de trabajar es puramente basado en el pase de mensajes, no se cuenta con una estructura de datos tipo canales o buffer.


## Referencias

https://snyk.io/blog/node-js-multithreading-with-worker-threads/

https://snyk.io/blog/node-js-multithreading-worker-threads-pros-cons/

https://github.com/piscinajs/piscina

https://www.npmjs.com/package/bree

