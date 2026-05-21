// Compresor de imágenes nativo en el cliente utilizando Canvas
// Evita dependencias externas y optimiza la velocidad y almacenamiento

export const compressImage = (file: File, maxDimension = 1600, quality = 0.75): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Si el archivo no es una imagen, rechazar
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen válida'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar proporcionalmente si excede la dimensión máxima
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el Canvas 2D'));
          return;
        }

        // Dibujar la imagen en el canvas con el nuevo tamaño
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir el canvas a un Blob de tipo JPEG con compresión de calidad
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('No se pudo generar el Blob de la imagen comprimida'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar el objeto de imagen'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
    reader.readAsDataURL(file);
  });
};
