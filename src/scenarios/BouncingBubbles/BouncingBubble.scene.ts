import { Line, Scene } from '@2d'
import { distance2d, randomRange } from '@Utils'

import { Bubble } from './Bubble'

export class BouncingBubbleScene extends Scene {
  private bubbles: Bubble[] = []

  constructor(nBubbles: number, id: string) {
    super(id)

    this.params.threshold = 100
    this.params.lineWidth = 2
    this.params.speed = 1
    this.params.radius = 10
    this.params.strokeWeight = 2
    this.params.nBubbles = nBubbles

    this.debugFolder?.add(this.params, 'threshold', 0, 350)
    this.debugFolder?.add(this.params, 'speed', -10, 10, 0.25)
    this.debugFolder?.add(this.params, 'radius', 0, 50)
    this.debugFolder
      ?.add(this.params, 'strokeWeight', 0, 10, 1)
      .name('stroke weight')
    this.debugFolder
      ?.add(this.params, 'nBubbles', 0, 500, 1)
      .name('Bubbles number')

    for (let i = 0; i < nBubbles; i++) {
      const x_ = randomRange(
        this.params.radius,
        this.width - this.params.radius
      )
      const y__ = randomRange(
        this.params.radius,
        this.height - this.params.radius
      )
      const bubble_ = new Bubble(this.context, x_, y__, this.params.radius)
      this.bubbles.push(bubble_)
    }
  }

  update() {
    if (!super.update()) return

    this.clear()
    this.bubbles.forEach((b) => {
      b.update(
        this.width,
        this.height,
        this.windowContext.time.delta,
        this.params.speed,
        this.params.radius
      )
    })

    // Nb bubbles changes
    if (this.params.nBubbles !== this.bubbles.length) {
      this.bubbles = this.bubbles.slice(0, this.params.nBubbles)
      for (let i = this.bubbles.length; i < this.params.nBubbles; i++) {
        const x_ = randomRange(
          this.params.radius,
          this.width - this.params.radius
        )
        const y__ = randomRange(
          this.params.radius,
          this.height - this.params.radius
        )
        const bubble_ = new Bubble(this.context, x_, y__, this.params.radius)
        this.bubbles.push(bubble_)
      }
    }

    this.draw()
  }

  draw() {
    /** style */
    this.context.strokeStyle = 'white'
    this.context.fillStyle = 'black'
    this.context.lineWidth = this.params.strokeWeight

    if (!!this.bubbles) {
      for (let i = 0; i < this.bubbles.length; i++) {
        const current_ = this.bubbles[i]
        for (let j = i; j < this.bubbles.length; j++) {
          const next_ = this.bubbles[j]

          if (
            distance2d(current_.x, current_.y, next_.x, next_.y) <
            this.params.threshold
          ) {
            Line(this.context, current_.x, current_.y, next_.x, next_.y)
          }
        }
      }

      this.bubbles.forEach((b) => {
        b.draw()
      })
    }
  }

  resize() {
    super.resize()

    if (!!this.bubbles) {
      this.bubbles.forEach((b) => {
        b.x = b.x > this.width - b.radius ? this.width - b.radius : b.x
        b.y = b.y > this.height - b.radius ? this.height - b.radius : b.y
      })
    }
  }
}
