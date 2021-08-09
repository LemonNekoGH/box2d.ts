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

export const DRAW_STRING_NEW_LINE: number = 16;

export function RandomFloat(lo: number = -1, hi: number = 1) {
  let r = Math.random();
  r = (hi - lo) * r + lo;
  return r;
}

export class Test {
  public static readonly k_maxContactPoints: number = 2048;

  public m_world: b2.World;
  public m_bomb: b2.Body | null = null;
  public m_textLine: number = 30;
  public m_mouseJoint: b2.MouseJoint | null = null;
  public m_pointCount: number = 0;
  public readonly m_bombSpawnPoint: b2.Vec2 = new b2.Vec2();
  public m_bombSpawning: boolean = false;
  public readonly m_mouseWorld: b2.Vec2 = new b2.Vec2();
  public m_stepCount: number = 0;
  public readonly m_maxProfile: b2.Profile = new b2.Profile();
  public readonly m_totalProfile: b2.Profile = new b2.Profile();
  public m_groundBody: b2.Body;

  constructor() {
    const gravity: b2.Vec2 = new b2.Vec2(0, -10);
    this.m_world = new b2.World(gravity);
    this.m_bomb = null;
    this.m_textLine = 30;
    this.m_mouseJoint = null;

    this.m_world.SetDebugDraw(g_debugDraw);

    const bodyDef: b2.BodyDef = new b2.BodyDef();
    this.m_groundBody = this.m_world.CreateBody(bodyDef);
  }

  public Step(settings: Settings): void {
    let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;

    if (settings.m_pause) {
      if (settings.m_singleStep) {
        settings.m_singleStep = false;
      } else {
        timeStep = 0;
      }

      g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
      this.m_textLine += DRAW_STRING_NEW_LINE;
    }

    g_debugDraw.SetFlags(b2DrawFlags.e_shapeBit);

    this.m_world.SetAllowSleeping(true);
    this.m_world.SetWarmStarting(true);
    this.m_world.SetContinuousPhysics(true);
    this.m_world.SetSubStepping(false);

    this.m_pointCount = 0;

    this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations);

    this.m_world.DebugDraw();

      ++this.m_stepCount;

    if (this.m_bombSpawning) {
      const c: b2.Color = new b2.Color(0, 0, 1);
      g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);

      c.SetRGB(0.8, 0.8, 0.8);
      g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
    }
  }

  public GetDefaultViewZoom(): number {
    return 1.0;
  }

  public static readonly k_ParticleColors: b2.Color[] = [
    new b2.Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff), // red
    new b2.Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff), // green
    new b2.Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff), // blue
    new b2.Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff), // orange
    new b2.Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff), // turquoise
    new b2.Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff), // magenta
    new b2.Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff), // gold
    new b2.Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff), // cyan
  ];

  public static readonly k_ParticleColorsCount = Test.k_ParticleColors.length;

  // #endif
}
