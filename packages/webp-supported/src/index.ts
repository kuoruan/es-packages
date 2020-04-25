let supported: boolean;

export default function WebPSupported(): boolean {
  if (typeof supported !== "undefined") {
    return supported;
  }

  const el: HTMLCanvasElement = document.createElement("canvas");

  return (supported =
    typeof el.toDataURL === "function" &&
    el.toDataURL("image/webp").indexOf("data:image/webp") === 0);
}
