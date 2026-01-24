import { GateMaterial } from "@/components/GateShaderMaterial"
import { ReactThreeFiber } from "@react-three/fiber"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gateMaterial: ReactThreeFiber.Object3DNode<
        typeof GateMaterial,
        typeof GateMaterial
      >
    }
  }
}
