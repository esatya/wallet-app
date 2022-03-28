import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} {...props}>
    <G data-name="Group 9">
      <Path
        data-name="Path 13"
        d="M8 16a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v14a1 1 0 0 1-1 1Z"
        fill="#fff"
      />
    </G>
    <G data-name="Group 10">
      <Path
        data-name="Path 14"
        d="M15 9H1a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2Z"
        fill="#fff"
      />
    </G>
  </Svg>
)

export default SvgComponent
