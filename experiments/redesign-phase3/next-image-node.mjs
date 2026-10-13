// Next's CommonJS image entry needs explicit interop outside its own compiler.
import imageModule from 'next/image.js';
export const getImageProps=imageModule.getImageProps;
export default imageModule.default;
