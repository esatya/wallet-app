import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} {...props}>
    <Path
      d="M3 18v3H0v-3Zm-3 9h3v-3H0Zm3-6v3h3v-3Zm6-9H6v3H3v3h6Zm-9 0v3h3v-3Zm9 12H6v3h7.5v-3H12v-3H9Zm6-22.5h-3v3h3ZM12 12h3V7.5h-3ZM1.5 9A1.5 1.5 0 0 1 0 7.5v-6A1.5 1.5 0 0 1 1.5 0h6A1.5 1.5 0 0 1 9 1.5v6A1.5 1.5 0 0 1 7.5 9ZM3 6h3V3H3Zm24-4.5v12h-3V9h-4.5A1.5 1.5 0 0 1 18 7.5v-6A1.5 1.5 0 0 1 19.5 0h6A1.5 1.5 0 0 1 27 1.5ZM24 3h-3v3h3Zm3 16.5v6a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V21h-6v-6h3v3h1.5v-6h3v6h6a1.5 1.5 0 0 1 1.5 1.5ZM24 21h-3v3h3Z"
      fill="#fff"
    />
  </Svg>
)

export default SvgComponent
