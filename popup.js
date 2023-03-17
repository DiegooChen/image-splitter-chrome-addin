document.getElementById('image-input').addEventListener('change', async function (e) {
  const file = e.target.files[0];
  const image = new Image();
  image.src = URL.createObjectURL(file);

  image.onload = async function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const halfWidth = Math.floor(image.width / 2);
    const halfHeight = Math.floor(image.height / 2);

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        const croppedImageData = ctx.getImageData(x * halfWidth, y * halfHeight, halfWidth, halfHeight);
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = halfWidth;
        croppedCanvas.height = halfHeight;

        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.putImageData(croppedImageData, 0, 0);

        const dataURL = croppedCanvas.toDataURL();
        await downloadDataURL(dataURL, `image_part_${x}_${y}.png`);
      }
    }
  };
});

async function downloadDataURL(dataURL, filename) {
  const response = await fetch(dataURL);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);

  link.click();

  setTimeout(() => {
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  }, 100);
}
