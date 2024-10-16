const { v4: uuidv4 } = require('uuid');
const yargs = require("yargs")
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

            contentJS.push(persona)

            writeFileSync(`${__dirname}/files/personas.txt`,JSON.stringify(contentJS),"utf-8")

            console.log(clc.green("Registro de persona exitoso"));
            
        }
    )
    .help().argv