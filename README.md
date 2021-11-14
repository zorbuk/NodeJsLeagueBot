# NodeJsLeagueBot

**Aviso**
> Este proyecto se ha iniciado básicamente para expandir mis conocimientos en NodeJs. Sé que los métodos usados pueden no ser los  más adecuados. 
> Por ahora el proyecto es **público** y puede verlo y usarlo todo el que quiera.

**¿Que es NodeJsLeagueBot?**

> Es un programa que permite subir cuentas de League of Legends automáticamente y ver el estado de la misma.

**Discord**
https://discord.gg/KZXVh8SbA9

**Requisitos**
 - [Windows 10 Supercompact](https://www.youtube.com/watch?v=guS5ovEdISQ)
  - [VMWare](https://www.vmware.com/es/products/workstation-pro/workstation-pro-evaluation.html) o [Virtual Box](https://www.virtualbox.org)
 - [Java](https://www.java.com/es/)
 - [Npm](https://www.npmjs.com)
 - [Git](https://git-scm.com/downloads)
 - [Nodejs](https://nodejs.org/es/)

**Recursos**
 - [(Video) Configuración de Maquina Virtual para League of Legends](https://www.youtube.com/watch?v=oyKsg-pMfOU)

**Instalación**
1. Instalar Gitm, Npm y Nodejs en nuestra maquina host.
2. Abrir un terminal CMD y clonar el proyecto en nuestra maquina host con `git clone https://github.com/zorbuk/NodeJsLeagueBot.git `
3. Acceder a la carpeta de NodeJsLeagueBot con el comando `cd NodeJsLeagueBot-master`y ejecutar `npm i` eso debería crear la carpeta `node_modules` que se moverá más adelante.
4. Desde la misma carpeta, ejecutar `npm install -g pkg` y luego `pkg .` eso creará el ejecutable `nodejsleaguebot-master-win.exe`.
5. Antes de configurar la máquina virtual, necesitarás dos Network Adapter (Uno que hara de Bridge y otro NAT).
![enter image description here](https://i.gyazo.com/53c57a508d85641b6119453009a1186f.png)
6. Seguir el vídeo de recursos para configurar la máquina virtual.
7. Una vez instalado league of legends y con la máquina virtual lista, instalar Java y Nodejs en la maquina virtual.
8.  Abrir Regedit y entrar al siguiente registro `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000` buscar `DriverDesc`y modificar el valor por `ATI/NVIDIA SVGA II`
![enter image description here](https://i.gyazo.com/bdc85c9b5cfce19715d35b0bcfed3130.png)
9. Crear una partida personalizada en League of Legends y comprobar que funciona, configura el autoattack move en la A y habilita smart cast.
10. Configurar una carpeta compartida de `NodeJsLeagueBot-master` para trabajar entre el host y la máquina virtual.
![enter image description here](https://i.gyazo.com/88fcf9b5a1098c2fa130d9bbab121b60.png)
11. Copiar `NodeJsLeagueBot-master` del host a la máquina virtual.
12. Ir a C:\ y crear una carpeta con el nombre `snapshot`dentro otra con el nombre `NodeJsLeagueBot-master`y mover ahí dentro la carpeta `node_modules` debe quedar así: `c:\snapshot\NodeJsLeagueBot-master\node_modules`.
![enter image description here](https://i.gyazo.com/46c7560432efdd4c7d077f3d676ad522.png)
13. En desktop crear la carpeta `NodeJsLeagueBot-master` y mover dentro los siguientes archivos `nodejsleaguebot-master-win.exe`, `lockfilepath.json`, `settings.json` y la carpeta `views`.
![enter image description here](https://i.gyazo.com/0581d4b67e020cab90309e21caab5263.png)
14. Edita `lockfilepath.json` con la ruta a lockfile que dispongas, si instalaste league of legends en la carpeta C:\ debería ser esta: `C:\\Riot Games\\League of Legends\\lockfile`
15. Ejecuta`nodejsleaguebot-master-win.exe` y accede por web a la IP que otorga.

**Posibles problemas**
P: No se puede acceder a la web desde el host.
R: En la máquina virtual, deshabilita el firewall. Revisa el punto 4 para ver la configuración de las tarjetas de red.

P: Se me cierra al abrir.
R: El punto 13. No has puesto bien la ruta al lockfile.

P: Salen muchos errores en la consola.
R: Punto 3 y 11. Revisa que la carpeta node_modules este en la ruta correcta.

**Developper**

> Miquel Valero ([Linkedin](https://www.linkedin.com/in/miquel-valero-recasens-800829194/))