const SensorData = require('../models/SensorData');

// 1. Ingesta de lectura desde el ESP32 (POST)
exports.receiveData = async (req, res) => {
  try {
    const { deviceId, movimiento, distancia, bache, lat, lng } = req.body;

    if (distancia === undefined) {
      return res.status(400).json({ error: 'El campo distancia es obligatorio' });
    }

    const data = new SensorData({
      deviceId: deviceId || 'ESP32-01',
      movimiento: Boolean(movimiento),
      distancia: Number(distancia),
      bache: Boolean(bache),
      lat: lat !== undefined ? Number(lat) : 0,
      lng: lng !== undefined ? Number(lng) : 0
    });

    await data.save();
    return res.status(201).json({ message: 'Guardado exitosamente', id: data._id });
  } catch (error) {
    console.error('Error al guardar datos del sensor:', error);
    return res.status(500).json({ error: 'Error al registrar telemetria' });
  }
};

// 2. Consulta de todos los registros para Mapa y Admin (GET)
exports.getAllData = async (req, res) => {
  try {
    const datos = await SensorData.find().sort({ timestamp: -1 });
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al consultar baches:', error);
    return res.status(500).json({ error: 'Error al obtener datos' });
  }
};

// 3. Actualizar coordenadas o estado de reparacion (PATCH)
exports.updateBache = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const bacheActualizado = await SensorData.findByIdAndUpdate(
      id, 
      updates, 
      { new: true }
    );

    if (!bacheActualizado) {
      return res.status(404).json({ message: 'Bache no encontrado' });
    }

    return res.status(200).json(bacheActualizado);
  } catch (error) {
    console.error('Error al actualizar bache:', error);
    return res.status(500).json({ error: 'Error al actualizar bache' });
  }
};

// 4. Eliminar registro de bache (DELETE)
exports.deleteBache = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await SensorData.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Bache no encontrado' });
    }

    return res.status(200).json({ message: 'Bache eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar bache:', error);
    return res.status(500).json({ error: 'Error al eliminar bache' });
  }
};
