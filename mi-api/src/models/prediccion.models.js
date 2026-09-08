let imagenes = [];
let idImagen = 1;

function agregarImagen(parcelaId, archivo) {
  const nueva = {
    id: idImagen++,
    parcelaId: Number(parcelaId),
    nombreArchivo: archivo.filename,
    rutaArchivo: archivo.path,
    mimeType: archivo.mimetype,
    tamanioBytes: archivo.size,
    createdAt: new Date().toISOString(),
  };
  imagenes.push(nueva);
  return nueva;
}

function listarImagenesPorParcela(parcelaId) {
  return imagenes.filter((img) => img.parcelaId === Number(parcelaId));
}

module.exports = { agregarImagen, listarImagenesPorParcela };