const SIZES = {
  xs: "h-10 w-10",
  sm: "h-12 w-12",
  md: "h-28 w-28",
  lg: "h-56 w-56 md:h-64 md:w-64",
  xl: "h-72 w-72 md:h-80 md:w-80",
};

export function ProfilePhoto({
  src = "/neha-pfp.jpeg",
  alt = "Neha Jha",
  size = "md",
  rounded = "rounded-full",
  className = "",
  position = "center 20%",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${SIZES[size]} ${rounded} object-cover shadow-md ring-2 ring-white/80 ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
