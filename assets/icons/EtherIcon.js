import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21.367}
    height={33.577}
    {...props}
  >
    <Path
      data-name="Path 5"
      d="M0 16.789 10.684 0l10.683 16.789-10.684 6.1Z"
      fill="#7880e7"
    />
    <Path
      data-name="Path 6"
      d="m10.684 0 10.684 16.789-10.684 6.105Z"
      fill="#5c64c7"
    />
    <Path
      data-name="Path 7"
      d="m0 19.078 10.684 6.1 10.683-6.1-10.683 14.5Z"
      fill="#7880e7"
    />
    <Path
      data-name="Path 8"
      d="m10.684 25.183 10.684-6.1-10.684 14.5ZM0 16.789l10.684-4.579 10.684 4.579-10.684 6.1Z"
      fill="#5c64c7"
    />
    <Path
      data-name="Path 9"
      d="m10.684 12.21 10.684 4.579-10.684 6.105Z"
      fill="#2a3192"
    />
  </Svg>
)

export default SvgComponent
