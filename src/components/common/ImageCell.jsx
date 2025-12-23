import { useState } from "react";

const ImageCell = ({
  src,
  fallback,
  alt = "image",
  width = 40, 
  height = 20, 
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      onError={() => setImgSrc(fallback)}
      className={`object-cover rounded border ${className}`}
    />
  );
};

export default ImageCell;
