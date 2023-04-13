import React from "react";

const MemoImage = React.memo(function Image({ src, alt }) {
  return (
    <img
      src={src}
      className="h-28 w-full object-cover transition-all duration-100 hover:scale-110"
      alt={alt}
    />
  );
});

export default MemoImage;
