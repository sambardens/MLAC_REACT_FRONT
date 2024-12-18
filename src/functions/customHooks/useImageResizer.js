import { useState } from 'react';
import Resizer from 'react-image-file-resizer';

const useImageResizer = () => {
  const [resizedImage, setResizedImage] = useState(null);

  const resizeImage = (file, maxWidth, maxHeight, quality = 80) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'png',
      quality,
      0,
      (resizedImage) => {
        setResizedImage(resizedImage);
      },
      'file',
    );
  };
  return [resizedImage, resizeImage];
};

export default useImageResizer;
