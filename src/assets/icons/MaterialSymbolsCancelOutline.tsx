import { SVGProps } from "react";

type MaterialSymbolsCancelOutlineProps = SVGProps<SVGSVGElement> & {
  color: string;
  width?: string;
  height?: string;
};

export function MaterialSymbolsCancelOutline(props: MaterialSymbolsCancelOutlineProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : "1em"}
      height={props.height ? props.height : "1em"}
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill={props.color}
        d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6L8.4 17Zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
      ></path>
    </svg>
  );
}
export default MaterialSymbolsCancelOutline;
