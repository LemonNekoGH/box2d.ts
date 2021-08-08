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
import {Settings} from "./settings.js";
import {g_debugDraw} from "./draw.js";
// #if B2_ENABLE_PARTICLE
import {FullScreenUI} from "./fullscreen_ui.js";
import {b2DrawFlags} from "../build/common/b2_draw";
// #endif

export const DRAW_STRING_NEW_LINE: number = 16;

export function RandomFloat(lo: number = -1, hi: number = 1) {
  let r = Math.random();
  r = (hi - lo) * r + lo;
  return r;
}

export class TestEntry {
  public category: string = "";
  public name: string = "unknown";
  public createFcn: () => Test;

  constructor(category: string, name: string, createFcn: () => Test) {
    this.category = category;
    this.name = name;
    this.createFcn = createFcn;
  }
}

export const g_testEntries: TestEntry[] = []

export class ContactPoint {
  public fixtureA!: b2.Fixture;
  public fixtureB!: b2.Fixture;
  public readonly normal: b2.Vec2 = new b2.Vec2();
  public readonly position: b2.Vec2 = new b2.Vec2();
  public state: b2.PointState = b2.PointState.b2_nullState;
  public normalImpulse: number = 0;
  public tangentImpulse: number = 0;
  public separation: number = 0;
}

export class Test extends b2.ContactListener {
  // #if B2_ENABLE_PARTICLE
  public static readonly fullscreenUI = new FullScreenUI();
  // #endif
  public static readonly k_maxContactPoints: number = 2048;

  public m_world: b2.World;
  // #if B2_ENABLE_PARTICLE
  public m_particleSystem: b2.ParticleSystem;
  // #endif
  public m_bomb: b2.Body | null = null;
  public m_textLine: number = 30;
  public m_mouseJoint: b2.MouseJoint | null = null;
  public readonly m_points: ContactPoint[] = b2.MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
  public m_pointCount: number = 0;
  public readonly m_bombSpawnPoint: b2.Vec2 = new b2.Vec2();
  public m_bombSpawning: boolean = false;
  public readonly m_mouseWorld: b2.Vec2 = new b2.Vec2();
  // #if B2_ENABLE_PARTICLE
  public m_mouseTracing: boolean = false;
  public readonly m_mouseTracerPosition: b2.Vec2 = new b2.Vec2();
  public readonly m_mouseTracerVelocity: b2.Vec2 = new b2.Vec2();
  // #endif
  public m_stepCount: number = 0;
  public readonly m_maxProfile: b2.Profile = new b2.Profile();
  public readonly m_totalProfile: b2.Profile = new b2.Profile();
  public m_groundBody: b2.Body;

  constructor() {
    super();

    // #if B2_ENABLE_PARTICLE
    const particleSystemDef = new b2.ParticleSystemDef();
    // #endif
    const gravity: b2.Vec2 = new b2.Vec2(0, -10);
    this.m_world = new b2.World(gravity);
    // #if B2_ENABLE_PARTICLE
    this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
    // #endif
    this.m_bomb = null;
    this.m_textLine = 30;
    this.m_mouseJoint = null;

    this.m_world.SetContactListener(this);
    this.m_world.SetDebugDraw(g_debugDraw);

    // #if B2_ENABLE_PARTICLE
    this.m_particleSystem.SetGravityScale(0.4);
    this.m_particleSystem.SetDensity(1.2);
    // #endif

    const bodyDef: b2.BodyDef = new b2.BodyDef();
    this.m_groundBody = this.m_world.CreateBody(bodyDef);
  }

  public JointDestroyed(joint: b2.Joint): void {}

  // #if B2_ENABLE_PARTICLE
  public ParticleGroupDestroyed(group: b2.ParticleGroup) {}
  // #endif

  public BeginContact(contact: b2.Contact): void {}

  public EndContact(contact: b2.Contact): void {}

  private static PreSolve_s_state1: b2.PointState[] = [/*b2.maxManifoldPoints*/];
  private static PreSolve_s_state2: b2.PointState[] = [/*b2.maxManifoldPoints*/];
  private static PreSolve_s_worldManifold: b2.WorldManifold = new b2.WorldManifold();
  public PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void {
    const manifold: b2.Manifold = contact.GetManifold();

    if (manifold.pointCount === 0) {
      return;
    }

    const fixtureA: b2.Fixture | null = contact.GetFixtureA();
    const fixtureB: b2.Fixture | null = contact.GetFixtureB();

    const state1: b2.PointState[] = Test.PreSolve_s_state1;
    const state2: b2.PointState[] = Test.PreSolve_s_state2;
    b2.GetPointStates(state1, state2, oldManifold, manifold);

    const worldManifold: b2.WorldManifold = Test.PreSolve_s_worldManifold;
    contact.GetWorldManifold(worldManifold);

    for (let i: number = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
      const cp: ContactPoint = this.m_points[this.m_pointCount];
      cp.fixtureA = fixtureA;
      cp.fixtureB = fixtureB;
      cp.position.Copy(worldManifold.points[i]);
      cp.normal.Copy(worldManifold.normal);
      cp.state = state2[i];
      cp.normalImpulse = manifold.points[i].normalImpulse;
      cp.tangentImpulse = manifold.points[i].tangentImpulse;
      cp.separation = worldManifold.separations[i];
      ++this.m_pointCount;
    }
  }

  public PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse): void {}

  public MouseDown(p: b2.Vec2): void {
    this.m_mouseWorld.Copy(p);
    // #if B2_ENABLE_PARTICLE
    this.m_mouseTracing = true;
    this.m_mouseTracerPosition.Copy(p);
    this.m_mouseTracerVelocity.SetZero();
    // #endif

    if (this.m_mouseJoint !== null) {
      this.m_world.DestroyJoint(this.m_mouseJoint);
      this.m_mouseJoint = null;
    }

    let hit_fixture: b2.Fixture | null | any = null; // HACK: tsc doesn't detect calling callbacks

    // Query the world for overlapping shapes.
    this.m_world.QueryPointAABB(p, (fixture: b2.Fixture): boolean => {
      const body = fixture.GetBody();
      if (body.GetType() === b2.BodyType.b2_dynamicBody) {
        const inside = fixture.TestPoint(p);
        if (inside) {
          hit_fixture = fixture;
          return false; // We are done, terminate the query.
        }
      }
      return true; // Continue the query.
    });

    if (hit_fixture) {
      const frequencyHz = 5.0;
      const dampingRatio = 0.7;

      const body = hit_fixture.GetBody();
      const jd: b2.MouseJointDef = new b2.MouseJointDef();
      jd.bodyA = this.m_groundBody;
      jd.bodyB = body;
      jd.target.Copy(p);
      jd.maxForce = 1000 * body.GetMass();
      b2.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);

      this.m_mouseJoint = this.m_world.CreateJoint(jd);
      body.SetAwake(true);
    }
  }

  public SpawnBomb(worldPt: b2.Vec2): void {
    this.m_bombSpawnPoint.Copy(worldPt);
    this.m_bombSpawning = true;
  }

  public CompleteBombSpawn(p: b2.Vec2): void {
    if (!this.m_bombSpawning) {
      return;
    }

    const multiplier: number = 30;
    const vel: b2.Vec2 = b2.Vec2.SubVV(this.m_bombSpawnPoint, p, new b2.Vec2());
    vel.SelfMul(multiplier);
    this.LaunchBombAt(this.m_bombSpawnPoint, vel);
    this.m_bombSpawning = false;
  }

  public ShiftMouseDown(p: b2.Vec2): void {
    this.m_mouseWorld.Copy(p);

    if (this.m_mouseJoint !== null) {
      return;
    }

    this.SpawnBomb(p);
  }

  public MouseUp(p: b2.Vec2): void {
    // #if B2_ENABLE_PARTICLE
    this.m_mouseTracing = false;
    // #endif
    if (this.m_mouseJoint) {
      this.m_world.DestroyJoint(this.m_mouseJoint);
      this.m_mouseJoint = null;
    }

    if (this.m_bombSpawning) {
      this.CompleteBombSpawn(p);
    }
  }

  public MouseMove(p: b2.Vec2): void {
    this.m_mouseWorld.Copy(p);

    if (this.m_mouseJoint) {
      this.m_mouseJoint.SetTarget(p);
    }
  }

  public LaunchBombAt(position: b2.Vec2, velocity: b2.Vec2): void {
    if (this.m_bomb) {
      this.m_world.DestroyBody(this.m_bomb);
      this.m_bomb = null;
    }

    const bd: b2.BodyDef = new b2.BodyDef();
    bd.type = b2.BodyType.b2_dynamicBody;
    bd.position.Copy(position);
    bd.bullet = true;
    this.m_bomb = this.m_world.CreateBody(bd);
    this.m_bomb.SetLinearVelocity(velocity);

    const circle: b2.CircleShape = new b2.CircleShape();
    circle.m_radius = 0.3;

    const fd: b2.FixtureDef = new b2.FixtureDef();
    fd.shape = circle;
    fd.density = 20;
    fd.restitution = 0;

    // b2.Vec2 minV = position - b2.Vec2(0.3f,0.3f);
    // b2.Vec2 maxV = position + b2.Vec2(0.3f,0.3f);

    // b2.AABB aabb;
    // aabb.lowerBound = minV;
    // aabb.upperBound = maxV;

    this.m_bomb.CreateFixture(fd);
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

    this.m_world.SetAllowSleeping(settings.m_enableSleep);
    this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
    this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
    this.m_world.SetSubStepping(settings.m_enableSubStepping);
    // #if B2_ENABLE_PARTICLE
    this.m_particleSystem.SetStrictContactCheck(settings.m_strictContacts);
    // #endif

    this.m_pointCount = 0;

    // #if B2_ENABLE_PARTICLE
    this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations, settings.m_particleIterations);
    // #else
    // this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);
    // #endif

    this.m_world.DebugDraw();

    if (timeStep > 0) {
      ++this.m_stepCount;
    }

    // Track maximum profile times
    {
      const p = this.m_world.GetProfile();
      this.m_maxProfile.step = b2.Max(this.m_maxProfile.step, p.step);
      this.m_maxProfile.collide = b2.Max(this.m_maxProfile.collide, p.collide);
      this.m_maxProfile.solve = b2.Max(this.m_maxProfile.solve, p.solve);
      this.m_maxProfile.solveInit = b2.Max(this.m_maxProfile.solveInit, p.solveInit);
      this.m_maxProfile.solveVelocity = b2.Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
      this.m_maxProfile.solvePosition = b2.Max(this.m_maxProfile.solvePosition, p.solvePosition);
      this.m_maxProfile.solveTOI = b2.Max(this.m_maxProfile.solveTOI, p.solveTOI);
      this.m_maxProfile.broadphase = b2.Max(this.m_maxProfile.broadphase, p.broadphase);

      this.m_totalProfile.step += p.step;
      this.m_totalProfile.collide += p.collide;
      this.m_totalProfile.solve += p.solve;
      this.m_totalProfile.solveInit += p.solveInit;
      this.m_totalProfile.solveVelocity += p.solveVelocity;
      this.m_totalProfile.solvePosition += p.solvePosition;
      this.m_totalProfile.solveTOI += p.solveTOI;
      this.m_totalProfile.broadphase += p.broadphase;
    }

    if (this.m_bombSpawning) {
      const c: b2.Color = new b2.Color(0, 0, 1);
      g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);

      c.SetRGB(0.8, 0.8, 0.8);
      g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
    }
  }

  public ShiftOrigin(newOrigin: b2.Vec2): void {
    this.m_world.ShiftOrigin(newOrigin);
  }

  public GetDefaultViewZoom(): number {
    return 1.0;
  }

  // #if B2_ENABLE_PARTICLE
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
