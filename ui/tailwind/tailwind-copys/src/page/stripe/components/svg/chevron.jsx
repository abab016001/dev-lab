import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
export default function ChevronSvg({ arrow, size = 24, strokeWidth = 2 }) {
  switch (arrow) {
    case 'up':
      return <ChevronUp size={size} strokeWidth={strokeWidth} />;
    case 'down':
      return <ChevronDown size={size} strokeWidth={strokeWidth} />;
    case 'right':
      return <ChevronRight size={size} strokeWidth={strokeWidth} />;
  }
}