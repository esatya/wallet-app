import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28.035}
    height={26.98}
    {...props}
  >
    <G
      fill="none"
      stroke={props.color || "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <Path
        data-name="Path 24"
        d="M24.906 23.744H3.183V10.265L14.044.75l10.863 9.515Z"
      />
      <Path data-name="Path 25" d="M4.239 1.282v5.494l3.436-2.837V1.282Z" />
      <Path data-name="Line 1" d="M.75 26.23h26.535" />
      <Path
        data-name="Path 26"
        d="M14.044 12.93h0a2.924 2.924 0 0 1 2.924 2.924v7.89H11.12v-7.89a2.924 2.924 0 0 1 2.924-2.924Z"
      />
    </G>
  </Svg>
)

export default SvgComponent
