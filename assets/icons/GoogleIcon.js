import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={28.004} height={18} {...props}>
    <Path
      d="M17.881 7.218C18.491 11.531 16.651 18 9.121 18a9 9 0 1 1 0-18 9.157 9.157 0 0 1 6.138 2.342c-1.909 1.779-1.846 1.884-2.6 2.625a5.207 5.207 0 0 0-3.541-1.314 5.347 5.347 0 0 0 0 10.693c2.957 0 4.159-1.258 4.931-3.569H9.118V7.218Zm1.453 2.406V7.396h3.251V4.277h2.258v3.119H28v2.228h-3.157v3.208h-2.258V9.624h-3.251Z"
      fill="#fff"
      fillRule="evenodd"
    />
  </Svg>
)

export default SvgComponent
