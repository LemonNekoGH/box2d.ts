// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import {g_debugDraw} from "./draw.js";
import {b2DrawFlags} from "../build/common/b2_draw";
import {Settings} from "./settings";

export class Test {
  public m_world: b2.World;

  constructor() {
    this.m_world = new b2.World(new b2.Vec2(0, -10));
    this.m_world.SetDebugDraw(g_debugDraw);

    const bodyDef: b2.BodyDef = new b2.BodyDef();
    this.m_world.CreateBody(bodyDef);
    // BoxStack
    {
      const bd = new b2.BodyDef();
      this.m_world.CreateBody(bd);
      new b2.EdgeShape();
    }

    const xs = [0.0, -10.0, -5.0, 5.0, 10.0];

      const shape = new b2.PolygonShape();
      shape.SetAsBox(0.5, 0.5);

      const fd = new b2.FixtureDef();
      fd.shape = shape;
      fd.density = 1.0;
      fd.friction = 0.3;

      for (let i = 0; i < 15; ++i) {
        const bd = new b2.BodyDef();
        bd.type = b2.BodyType.b2_dynamicBody;
        const x = 0.0;
        bd.position.Set(xs[0] + x, 0.55 + 1.1 * i);
        const body = this.m_world.CreateBody(bd);
        body.CreateFixture(fd);
      }
  }

  public Step(settings: Settings): void {
    let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;

    g_debugDraw.SetFlags(b2DrawFlags.e_shapeBit);

    this.m_world.SetAllowSleeping(true);
    this.m_world.SetWarmStarting(true);
    this.m_world.SetContinuousPhysics(true);
    this.m_world.SetSubStepping(false);

    this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations);

    this.m_world.DebugDraw();
  }

  public GetDefaultViewZoom(): number {
    return 1.0;
  }
}
