const express = require('express');
const faker = require('faker');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

const API_BASE_URL = 'http://localhost:8080/api';

const getThresholdValue = (type) => {
    switch (type) {
        case 'pH':
            return faker.random.number({ min: 6, max: 8, precision: 0.1 }); // Valor típico de pH
        case 'Turbidez':
            return faker.random.number({ min: 0, max: 50 }); // Umbral de turbidez en NTU
        case 'Conductividad':
            return faker.random.number({ min: 0, max: 2000 }); // Umbral de conductividad en µS/cm
        default:
            return null; // Si no coincide, no establecer un valor
    }
};

app.get('/generate-sensors', async (req, res) => {
    const sensors = [];
    const numberOfSensors = 4; 

    for (let i = 0; i < numberOfSensors; i++) {
        const sensor = {
            name: faker.commerce.productName(),
            type: faker.random.arrayElement(['pH', 'Turbidez', 'Conductividad']),
            location: faker.address.streetAddress(),
            thresholdValue: getThresholdValue(type)
        };
        sensors.push(sensor);
    }

    try {
        const promises = sensors.map(sensor => 
            axios.post(`${API_BASE_URL}/sensors/add`, sensor)
        );
        const response = await Promise.all(promises);
        res.json({ message: 'Sensores generados y enviados', data: response.data });
    } catch (error) {
        console.error('Error al enviar sensores:', error);
        res.status(500).json({ message: 'Error al enviar sensores', error: error.message });
    }
});

app.get('/generate-water-quality-data', async (req, res) => {
    const waterQualityData = [];
    const numberOfRecords = 10;

    for (let i = 0; i < numberOfRecords; i++) {
        const record = {
            sensorId: faker.random.number({ min: 1, max: 10 }), 
            pH: faker.random.number({ min: 0, max: 14, precision: 0.1 }), 
            turbidity: faker.random.number({ min: 0, max: 100 }),
            conductivity: faker.random.number({ min: 0, max: 2000 }),
            timestamp: faker.date.recent(),
        };
        waterQualityData.push(record);
    }

    try {
        const promise = waterQualityData.map( waterQuality =>
            axios.post(`${API_BASE_URL}/water-quality-data/saving`, waterQuality)
        )
        const response = await Promise.all(promises);
        res.json({ message: 'Datos de calidad de agua generados y enviados', data: response.data });
    } catch (error) {
        console.error('Error al enviar datos de calidad de agua:', error);
        res.status(500).json({ message: 'Error al enviar datos de calidad de agua', error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
