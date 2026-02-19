const express = require('express');
const crypto = require('crypto'); 
const app = express();
const PORT = 3000;

// Middleware para entender JSON (Requerimiento 1.a.i)
app.use(express.json());

// Middleware para asegurar que siempre respondemos JSON (opcional pero recomendado)
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Ruta de prueba para verificar que el servidor corre
app.get('/', (req, res) => {
    res.status(200).json({ 
        mensaje: "Servidor NodeJS funcionando correctamente",
        clase: "Aplicaciones Distribuidas"
    });
});

// Tarea 1: Mascaracteres

/** EJEMPLO:
    {
        "cadena1": "Hola",
        "cadena2": "Holaaa"
    }
 */

app.post('/mascaracteres', (req, res) => {
    const { cadena1, cadena2 } = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena1 !== 'string' || typeof cadena2 !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requieren 'cadena1' y 'cadena2' como texto."
        });
    }

    let resultado;
    
    // Lógica: Comparar longitudes
    if (cadena1.length >= cadena2.length) {
        resultado = cadena1; // Si es mayor o igual, se queda la primera
    } else {
        resultado = cadena2;
    }

    // Respuesta en JSON
    res.json({
        operacion: "mascaracteres",
        resultado: resultado,
        longitud: resultado.length
    });
});

// Tarea 2: Menoscaracteres

/** EJEMPLO:
    {
        "cadena1": "Hola",
        "cadena2": "Holaaa"
    }
 */

app.post('/mascaracteres', (req, res) => {
    const { cadena1, cadena2 } = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena1 !== 'string' || typeof cadena2 !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requieren 'cadena1' y 'cadena2' como texto."
        });
    }

    let resultado;
    
    // Lógica: Comparar longitudes
    if (cadena1.length <= cadena2.length) {
        resultado = cadena1; // Si es mayor o igual, se queda la primera
    } else {
        resultado = cadena2;
    }

    // Respuesta en JSON
    res.json({
        operacion: "menoscaracteres",
        resultado: resultado,
        longitud: resultado.length
    });
});

// Tarea 3: Numcaracteres

/** EJEMPLO:
    {
    "cadena": "Hola, cadena de texto de prueba"
    }
 */

app.post('/numcaracteres', (req, res) => {
    const { cadena} = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requiere 'cadena' como texto."
        });
    }

    let resultado;
    
    // Lógica: Medir Longitud
    const longitud = cadena.length;

    // Respuesta en JSON
    res.json({
        operacion: "numcaracteres",
        cadena: cadena,
        longitud: longitud
    })
});

// Tarea 4: Palindroma

/** EJEMPLO:
    {
    "cadena": "Hola, cadena de texto de prueba"
    }
 */

app.post('/palindroma', (req, res) => {
    const { cadena} = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requiere 'cadena' como texto."
        });
    }
    
    // Lógica: Medir Longitud
    function esPalindromo(str) {
        // 1. Limpiar: convertir a minúsculas y quitar no alfanuméricos
        const cadenaLimpia = str.toLowerCase().replace(/[\W_]/g, '');        
        // 2. Invertir: separar en arreglo, revertir y unir
        const cadenaInvertida = cadenaLimpia.split('').reverse().join('');        
        // 3. Comparar
        return cadenaLimpia === cadenaInvertida;
    }

    const resultado = esPalindromo(cadena);


    // Respuesta en JSON
    res.json({
        operacion: "palindroma",
        cadena: cadena,
        Palindromo: resultado
    })
});

// Tarea 5: Concatenar

/** EJEMPLO:
    {
        "cadena1": "Hola",
        "cadena2": "Profesor"
    }
 */

app.post('/concat', (req, res) => {
    const { cadena1, cadena2 } = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena1 !== 'string' || typeof cadena2 !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requieren 'cadena1' y 'cadena2' como texto."
        });
    }

    let resultado;
    
    // Lógica: Concatenar cadenas
    const concatenado = cadena1 + " " + cadena2;

    // Respuesta en JSON
    res.json({
        operacion: "concatenado",
        cadena1: cadena1,
        cadena2: cadena2,
        resultado: concatenado,
    });
});

// Tarea 6: Encriptado SHA256

/** EJEMPLO:
    {
        "cadena": "Hola, cadena de texto de prueba"
    }
 */

app.post('/applysha256', (req, res) => {
    const {cadena} = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requiere 'cadena' texto."
        });
    }

    let resultado;
    
    // Lógica: Encriptar
    const crypto = require('crypto');

    function calcularSHA256Node(mensaje) {
    return crypto.createHash('sha256').update(mensaje).digest('hex');
    }

    const encryp = calcularSHA256Node(cadena);

    // Respuesta en JSON
    res.json({
        operacion: "applysha256",
        cadena: cadena,
        resultado: encryp,
    });
});

// Tarea 7: Verificacion SHA256

/** EJEMPLO:
    {
        "cadena": "Hola, cadena de texto de prueba"
        "encrypt": "ee5ba0bfde1416de7a59d1f104f038f95c804cd3a625a83ed67f88d467fd736f"
    }
 */

app.post('/verifysha256', (req, res) => {
    const {cadena, encrypt} = req.body; // Recibimos parámetros en JSON

    // Validación: Verificar que ambos parámetros existan y sean cadenas
    if (typeof cadena !== 'string' || typeof encrypt !== 'string') {
        return res.status(400).json({
            error: "Parámetros inválidos. Se requieren 'cadena' y 'encyrpt' como texto."
        });
    }
    
    // Lógica: Encriptar
    const crypto = require('crypto');

    function calcularSHA256Node(mensaje) {
    return crypto.createHash('sha256').update(mensaje).digest('hex');
    }

    const encryp = calcularSHA256Node(cadena);

    function encriptacion(texto, encriptado) {
        if (texto == encriptado) {
            return true;
        } else {
            return false;
    }
}

const resultado = encriptacion(encryp, encrypt);

    // Respuesta en JSON
    res.json({
        operacion: "verifysha256",
        cadena: cadena,
        encrypt: encrypt,
        resultado: resultado,
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
