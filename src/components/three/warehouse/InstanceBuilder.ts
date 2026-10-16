import { Color, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import type { ColorRepresentation } from 'three'

type Vec3 = readonly [number, number, number]

export interface InstanceData {
  count: number
  matrices: Float32Array
  colors: Float32Array
}

export class InstanceBuilder {
  private readonly matrices: number[] = []
  private readonly colors: number[] = []
  private readonly matrix = new Matrix4()
  private readonly position = new Vector3()
  private readonly scale = new Vector3()
  private readonly quaternion = new Quaternion()
  private readonly euler = new Euler()
  private readonly color = new Color()

  add(
    position: Vec3,
    scale: Vec3,
    rotation: Vec3 = [0, 0, 0],
    color: ColorRepresentation = '#ffffff',
  ) {
    this.euler.set(rotation[0], rotation[1], rotation[2])
    this.quaternion.setFromEuler(this.euler)
    this.position.set(position[0], position[1], position[2])
    this.scale.set(scale[0], scale[1], scale[2])
    this.matrix.compose(this.position, this.quaternion, this.scale)
    this.matrices.push(...this.matrix.elements)

    this.color.set(color)
    this.colors.push(this.color.r, this.color.g, this.color.b)
  }

  build(): InstanceData {
    return {
      count: this.matrices.length / 16,
      matrices: new Float32Array(this.matrices),
      colors: new Float32Array(this.colors),
    }
  }
}

export function jitterColor(hex: string, amount: number, random: () => number) {
  return new Color(hex).offsetHSL(0, 0, (random() - 0.5) * amount)
}
