const { v4: uuidv4 } = require('uuid');
const yargs = require("yargs");
const clc = require("cli-color");
const { readFileSync, writeFileSync } = require("fs")

yargs
    .command(
        "saludar",
        "Comando utilizado para saludar recibiendo el nombre y apellido",
        {
            nombre: {
                alias: "n",
                describe: "Nombre para el saludo",
                demandOption: true,
                type: "string"
            },
            apellido: {
                alias: "a",
                describe: "Apellido para el saludo",
                demandOption: true,
                type: "string"
            }
        },
        ({nombre, apellido}) => {
            console.log(`Hola, bienvenido(a) ${nombre} ${apellido}`);
        }
    )
    .command(
        "crear",
        "Comando para registrar personas",
        {
            rut_dv: {
                alias: "rd",
                describe: "Dígito verificador del RUT de la persona a registrar",
                demandOption: true,
                type: "string"
            },
            rut_numero: {
                alias: "rn",
                describe: "Parte numérica del RUT de la persona a registrar",
                demandOption: true,
                type: "number"
            },
            nombre: {
                alias: "n",
                describe: "Nombre para el saludo",
                demandOption: true,
                type: "string"
            },
            apellido: {
                alias: "a",
                describe: "Apellido para el saludo",
                demandOption: true,
                type: "string"
            }
        },
        (arguments) => {
            const id = uuidv4();
            const { rut_dv, rut_numero, nombre, apellido } = arguments
            const persona = {
                id,
                rut_dv,
                rut_numero,
                nombre,
                apellido
            }
            const contentString = readFileSync(`${__dirname}/files/personas.txt`,"utf-8")
            const contentJS = JSON.parse(contentString)

            const busqueda = contentJS.some(item => item.rut_dv == rut_dv && item.rut_numero == rut_numero)

            if(busqueda) {
                return console.log(clc.red("RUT registrado previamente, por favor ingresar los datos de otra persona"));
            }

            contentJS.push(persona)

            writeFileSync(`${__dirname}/files/personas.txt`,JSON.stringify(contentJS),"utf-8")

            console.log(clc.green("Registro de persona exitoso"));
            
        }
    )
    .command(
        "listar",
        "Comando para mostrar la lista de personas registradas",
        {},
        () => {
            const contentString = readFileSync(`${__dirname}/files/personas.txt`,"utf8")
            const contentJS = JSON.parse(contentString)
            contentJS.sort((a,b) => a.rut_numero - b.rut_numero)
            const response = contentJS.map(item => {
                return {
                    id: item.id,
                    rut: `${item.rut_numero}-${item.rut_dv}`,
                    nombre: item.nombre,
                    apellido: item.apellido,
                }
            })
            console.table(response);
        }
    )
    .command(
        "modificar",
        "Comando utilizado para modificar los datos de una persona registrada",
        {
            id: {
                alias: "i",
                describe: "Identificación única de la persona a modificar",
                type: "string",
                demandOption: true,
            },
            rut_dv: {
                alias: "rd",
                describe: "Dígito verificador del RUT de la persona a registrar",
                demandOption: false,
                type: "string"
            },
            rut_numero: {
                alias: "rn",
                describe: "Parte numérica del RUT de la persona a registrar",
                demandOption: false,
                type: "number"
            },
            nombre: {
                alias: "n",
                describe: "Nombre para el saludo",
                demandOption: false,
                type: "string"
            },
            apellido: {
                alias: "a",
                describe: "Apellido para el saludo",
                demandOption: false,
                type: "string"
            }
        },
        ({ id, rut_dv, rut_numero, nombre, apellido}) => {
            if(rut_dv == undefined && rut_numero == undefined && nombre == undefined && apellido == undefined) {
                return console.log(clc.yellow("Por favor enviar al menos un atributo a modificar"));
            }

            const contentString = readFileSync(`${__dirname}/files/personas.txt`,"utf-8");
            const contentJS = JSON.parse(contentString);

            const busqueda = contentJS.find(item => item.id == id)

            if(busqueda == undefined) {
                return console.log(clc.red("Id de persona no registrada, por favor corregir"));
            }

            busqueda.nombre = nombre != undefined ? nombre : busqueda.nombre
            busqueda.apellido = apellido != undefined ? apellido : busqueda.apellido
            busqueda.rut_dv = rut_dv != undefined ? rut_dv : busqueda.rut_dv
            busqueda.rut_numero = rut_numero != undefined ? rut_numero : busqueda.rut_numero
           
            writeFileSync(`${__dirname}/files/personas.txt`, JSON.stringify(contentJS),"utf-8");
            console.log(clc.green("Persona modificada con éxito"));
        }
    )
    .help().argv