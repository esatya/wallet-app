import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={9.241}
    height={17.327}
    {...props}
  >
    <Path
      d="M.578 17.327a.578.578 0 0 1-.408-.986l7.677-7.677L.169.986A.578.578 0 1 1 .986.169l8.086 8.086a.578.578 0 0 1 0 .817L.986 17.158a.578.578 0 0 1-.408.169Z"
      fill="#a7a7a7"
    />
  </Svg>
)

export default SvgComponent
