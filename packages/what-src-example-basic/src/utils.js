
export const getStyle = (imgUrl) => ({
  backgroundImage: `url("${imgUrl}")`,
  width: '100%',
  height: '100%',
  backgroundPosition: 'center', /* Center the image */
  backgroundRepeat: 'no-repeat', /* Do not repeat the image */
  backgroundSize: 'cover', /* Resize the background image to cover the entire */
})
