import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    {...props}
  >
    <G data-name="Group 4">
      <Path
        data-name="Path 2"
        d="M9.41 0a9.366 9.366 0 1 0 9.41 9.366A9.39 9.39 0 0 0 9.41 0Zm0 17.791a8.425 8.425 0 1 1 8.469-8.425 8.443 8.443 0 0 1-8.469 8.425Zm3.058-8.9h-2.117v-2.1a.716.716 0 0 0-.706-.706.7.7 0 0 0-.706.706V8.9H6.822a.7.7 0 0 0-.706.706.706.706 0 0 0 .706.706h2.117v2.1a.706.706 0 1 0 1.411 0v-2.1h2.117a.706.706 0 1 0 0-1.411Z"
        fill="#fff"
      />
    </G>
  </Svg>
)

export default SvgComponent
