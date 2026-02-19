const express = require('express');
const app = express();
const PORT = 3000;
// --- BASE DE DATOS EN MEMORIA (Ejercicio 3) ---
let tareas = [];

app.use(express.json());

// --- EJERCICIO 1: Servicio de Saludo Básico ---
/** EJEMPLO:
    {
    "nombre": "Diego Márquez"
    }
 */
app.post('/saludo', (req, res) => {
    try {
        const { nombre } = req.body;

        // Validación básica
        if (!nombre || typeof nombre !== 'string') {
            return res.status(400).json({ 
                estado: 0, 
                mensaje: "Error: Se requiere un campo 'nombre' de tipo texto." 
            });
        }

        res.json({
            estado: 1,
            mensaje: `Hola, ${nombre}`
        });
    } catch (error) {
        res.status(500).json({ estado: 0, error: "Error interno del servidor" });
    }
});

// --- EJERCICIO 2: Calculadora de Operaciones Básicas ---
/** EJEMPLO:
    {
    "a": 8,
    "b": 5,
    "operacion": "suma"
    }
 */
app.post('/calcular', (req, res) => {
    try {
        const { a, b, operacion } = req.body;

        // Validación de tipos
        if (typeof a !== 'number' || typeof b !== 'number') {
            return res.status(400).json({ 
                estado: 0, 
                error: "Los campos 'a' y 'b' deben ser números." 
            });
        }

        let resultado = 0;

        switch (operacion.toLowerCase()) {
            case 'suma':
                resultado = a + b;
                break;
            case 'resta':
                resultado = a - b;
                break;
            case 'multiplicacion':
                resultado = a * b;
                break;
            case 'division':
                if (b === 0) {
                    return res.status(400).json({ 
                        estado: 0, 
                        error: "No se puede dividir por cero" 
                    });
                }
                resultado = a / b;
                break;
            default:
                return res.status(400).json({ 
                    estado: 0, 
                    error: "Operación no válida. Usa: suma, resta, multiplicacion, division" 
                });
        }

        res.json({
            estado: 1,
            resultado: resultado
        });

    } catch (error) {
        res.status(500).json({ estado: 0, error: "Error interno al calcular" });
    }
});

// --- EJERCICIO 3: Gestor de Tareas (CRUD) ---

// 1. CREAR una tarea (POST)
/** EJEMPLO:
    {
    "id": 1,
    "titulo": "Terminar practica 4 de Aplicaciones Distribuidas",
    "completada": false
    }

    {
    "id": 2,
    "titulo": "Terminar practica 5 de Dispositivos Programables",
    "completada": false
    }
 */

app.post('/tareas', (req, res) => {
    const { id, titulo, completada } = req.body;

    // Validación básica: que vengan los datos obligatorios
    if (id === undefined || !titulo) {
        return res.status(400).json({
            estado: 0,
            mensaje: "Faltan datos. Se requiere 'id' y 'titulo'."
        });
    }

    // Verificar si el ID ya existe para no duplicar
    const existe = tareas.find(t => t.id === id);
    if (existe) {
        return res.status(400).json({
            estado: 0,
            mensaje: "El ID ya existe."
        });
    }

    const nuevaTarea = { id, titulo, completada: completada || false };
    tareas.push(nuevaTarea);

    res.json({
        estado: 1,
        mensaje: "Tarea creada con éxito",
        tarea: nuevaTarea
    });
});

// 2. LISTAR todas las tareas (GET)
app.get('/tareas', (req, res) => {
    res.json({
        estado: 1,
        mensaje: "Lista de tareas",
        tareas: tareas // Regresamos el arreglo completo
    });
});

// 3. ACTUALIZAR una tarea por ID (PUT)
// La ruta usa un parámetro :id (ej. /tareas/1)
app.put('/tareas/:id', (req, res) => {
    const idBusqueda = parseInt(req.params.id); // Convertir el param de string a numero
    const { titulo, completada } = req.body;

    // Buscar el índice de la tarea en el arreglo
    const indice = tareas.findIndex(t => t.id === idBusqueda);

    if (indice !== -1) {
        // Si se encuentra, actualizamos solo los campos que nos envíen
        // Mantenemos el ID original y sobrescribimos lo demás si viene en el body
        tareas[indice].titulo = titulo || tareas[indice].titulo;
        if (completada !== undefined) tareas[indice].completada = completada;

        res.json({
            estado: 1,
            mensaje: "Tarea actualizada",
            tarea: tareas[indice]
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Tarea no encontrada"
        });
    }
});

// 4. ELIMINAR una tarea por ID (DELETE)
app.delete('/tareas/:id', (req, res) => {
    const idBusqueda = parseInt(req.params.id);

    // Buscar el índice
    const indice = tareas.findIndex(t => t.id === idBusqueda);

    if (indice !== -1) {
        // Eliminar 1 elemento en la posición encontrada
        const tareaEliminada = tareas.splice(indice, 1);
        
        res.json({
            estado: 1,
            mensaje: "Tarea eliminada",
            tarea: tareaEliminada[0] // Regresamos lo que borramos por si acaso
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Tarea no encontrada para eliminar"
        });
    }
});

// --- EJERCICIO 4: Validador de Contraseñas ---
/** EJEMPLO:
    {
    "password": "Hola1234"
    }
 */

app.post('/validar-password', (req, res) => {
    const { password } = req.body;

    // 1. Validar que se haya enviado el campo password
    if (!password || typeof password !== 'string') {
        return res.status(400).json({
            estado: 0,
            mensaje: "Se requiere el campo 'password' de tipo texto."
        });
    }

    const errores = [];

    // 2. Aplicar las reglas de validación una por una
    
    // Regla: Mínimo 8 caracteres
    if (password.length < 8) {
        errores.push("La contraseña debe tener al menos 8 caracteres.");
    }

    // Regla: Al menos una mayúscula (A-Z)
    if (!/[A-Z]/.test(password)) {
        errores.push("La contraseña debe contener al menos una letra mayúscula.");
    }

    // Regla: Al menos una minúscula (a-z)
    if (!/[a-z]/.test(password)) {
        errores.push("La contraseña debe contener al menos una letra minúscula.");
    }

    // Regla: Al menos un número (0-9)
    if (!/[0-9]/.test(password)) {
        errores.push("La contraseña debe contener al menos un número.");
    }

    // 3. Determinar si es válida (si el arreglo de errores está vacío)
    const esValida = errores.length === 0;

    // 4. Enviar respuesta con el formato solicitado
    res.json({
        estado: 1,      // El servicio funcionó correctamente
        esValida: esValida,
        errores: errores
    });
});

// --- EJERCICIO 5: Conversor de Temperatura ---
/** EJEMPLO:
    {
    "valor": 30,
    "desde": "c",
    "hacia": "f"
    }
 */
app.post('/convertir-temperatura', (req, res) => {
    try {
        const { valor, desde, hacia } = req.body;

        // 1. Validaciones
        // Verificar que el valor sea un número
        if (typeof valor !== 'number') {
            return res.status(400).json({
                estado: 0,
                mensaje: "El campo 'valor' debe ser un número."
            });
        }

        // Verificar que las escalas sean válidas (C, F, K)
        const escalasValidas = ['C', 'F', 'K'];
        // Convertimos a mayúsculas para evitar problemas si mandan 'c' en lugar de 'C'
        const escalaOrigen = desde ? desde.toUpperCase() : '';
        const escalaDestino = hacia ? hacia.toUpperCase() : '';

        if (!escalasValidas.includes(escalaOrigen) || !escalasValidas.includes(escalaDestino)) {
            return res.status(400).json({
                estado: 0,
                mensaje: "Escalas no válidas. Usa: C, F, K"
            });
        }

        // 2. Lógica de Conversión
        let resultado = valor;

        // Si las escalas son iguales, el resultado es el mismo valor
        if (escalaOrigen === escalaDestino) {
            resultado = valor;
        } else {
            // Convertimos todo a Celsius primero como base (puedes usar cualquier lógica)
            let valorEnCelsius;

            // Paso A: Convertir origen a Celsius
            if (escalaOrigen === 'C') {
                valorEnCelsius = valor;
            } else if (escalaOrigen === 'F') {
                valorEnCelsius = (valor - 32) * 5 / 9;
            } else if (escalaOrigen === 'K') {
                valorEnCelsius = valor - 273.15;
            }

            // Paso B: Convertir de Celsius al destino
            if (escalaDestino === 'C') {
                resultado = valorEnCelsius;
            } else if (escalaDestino === 'F') {
                resultado = (valorEnCelsius * 9 / 5) + 32;
            } else if (escalaDestino === 'K') {
                resultado = valorEnCelsius + 273.15;
            }
        }

        // 3. Respuesta
        // Redondeamos a 2 decimales para que se vea limpio
        res.json({
            estado: 1,
            valorOriginal: valor,
            valorConvertido: parseFloat(resultado.toFixed(2)),
            escalaOriginal: escalaOrigen,
            escalaConvertida: escalaDestino
        });

    } catch (error) {
        res.status(500).json({ estado: 0, error: "Error interno en la conversión" });
    }
});

// --- EJERCICIO 6: Buscador en Array ---
/** EJEMPLO:
    {
    "array": [1, 2, 3],
    "elemento": "5"
    }

    {
    "array": ["hola", 123, "mundo", true],
    "elemento": true
    }
 */

app.post('/buscar', (req, res) => {
    const { array, elemento } = req.body;

    // 1. Validar que 'array' sea realmente un arreglo
    if (!Array.isArray(array)) {
        return res.status(400).json({
            estado: 0,
            mensaje: "El campo 'array' debe ser una lista (arreglo)."
        });
    }

    // 2. Buscar el elemento (indexOf devuelve el índice o -1 si no existe)
    const indice = array.indexOf(elemento);
    
    // 3. Determinar si se encontró
    const encontrado = indice !== -1;

    // 4. Responder con el formato solicitado
    res.json({
        estado: 1,
        encontrado: encontrado,
        indice: indice, // Será -1 si no se encuentra
        tipoElemento: typeof elemento // Nos dice si buscamos un string, number, etc.
    });
});

// --- EJERCICIO 7: Contador de Palabras ---
/** EJEMPLO:
    {
    "texto": "Hola Profesor soy Diego Márquez y esto es una prueba"
    }
 */
app.post('/contar-palabras', (req, res) => {
    try {
        const { texto } = req.body;

        // 1. Validación básica
        if (typeof texto !== 'string') {
            return res.status(400).json({
                estado: 0,
                mensaje: "Se requiere el campo 'texto' de tipo string."
            });
        }

        // Caso especial: Cadena vacía
        if (texto.trim() === "") {
            return res.json({
                estado: 1,
                totalPalabras: 0,
                totalCaracteres: 0,
                palabrasUnicas: 0
            });
        }

        // 2. Procesamiento
        // Quitamos espacios al inicio y final
        const textoLimpio = texto.trim();
        
        // Dividimos el texto usando una Expresión Regular (/\s+/) 
        // esto separa por espacios, tabuladores o saltos de línea, ignorando espacios dobles.
        const arregloPalabras = textoLimpio.split(/\s+/);

        // A. Total de palabras
        const totalPalabras = arregloPalabras.length;

        // B. Total de caracteres (longitud total del string original)
        const totalCaracteres = texto.length;

        // C. Palabras únicas
        // Convertimos todo a minúsculas para normalizar y usamos un Set (que elimina duplicados automáticamente)
        const palabrasNormalizadas = arregloPalabras.map(p => p.toLowerCase());
        const setUnicas = new Set(palabrasNormalizadas);
        const palabrasUnicas = setUnicas.size;

        // 3. Respuesta
        res.json({
            estado: 1,
            totalPalabras: totalPalabras,
            totalCaracteres: totalCaracteres,
            palabrasUnicas: palabrasUnicas
        });

    } catch (error) {
        res.status(500).json({ estado: 0, error: "Error al procesar el texto" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de repaso corriendo en http://localhost:${PORT}`);
});