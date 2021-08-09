(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@box2d')) :
  typeof define === 'function' && define.amd ? define(['exports', '@box2d'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.testbed = {}, global.b2));
}(this, (function (exports, b2) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var b2__namespace = /*#__PURE__*/_interopNamespace(b2);

  // MIT License
  class Camera {
      constructor() {
          this.m_center = new b2__namespace.Vec2(0, 20);
          ///public readonly m_roll: b2.Rot = new b2.Rot(b2.DegToRad(0));
          this.m_extent = 25;
          this.m_zoom = 1;
          this.m_width = 1280;
          this.m_height = 800;
      }
  }
  // This class implements debug drawing callbacks that are invoked
  // inside b2World::Step.
  class DebugDraw extends b2__namespace.Draw {
      constructor() {
          super();
          this.m_ctx = null;
      }
      PushTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.translate(xf.p.x, xf.p.y);
              ctx.rotate(xf.q.GetAngle());
          }
      }
      PopTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.restore();
          }
      }
      DrawPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawCircle(center, radius, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidCircle(center, radius, axis, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              const cx = center.x;
              const cy = center.y;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, b2__namespace.pi * 2, true);
              ctx.moveTo(cx, cy);
              ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      // #if B2_ENABLE_PARTICLE
      DrawParticles(centers, radius, colors, count) {
          const ctx = this.m_ctx;
          if (ctx) {
              if (colors !== null) {
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      const color = colors[i];
                      ctx.fillStyle = color.MakeStyleString();
                      // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
                      ctx.fill();
                  }
              }
              else {
                  ctx.fillStyle = "rgba(255,255,255,0.5)";
                  // ctx.beginPath();
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, b2__namespace.pi * 2, true);
                      ctx.fill();
                  }
                  // ctx.fill();
              }
          }
      }
      // #endif
      DrawSegment(p1, p2, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              this.PushTransform(xf);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(1, 0);
              ctx.strokeStyle = b2__namespace.Color.RED.MakeStyleString(1);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, 1);
              ctx.strokeStyle = b2__namespace.Color.GREEN.MakeStyleString(1);
              ctx.stroke();
              this.PopTransform(xf);
          }
      }
      DrawPoint(p, size, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.fillStyle = color.MakeStyleString();
              size *= g_camera.m_zoom;
              size /= g_camera.m_extent;
              const hsize = size / 2;
              ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
          }
      }
      DrawString(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawString_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, x, y);
              ctx.restore();
          }
      }
  }
  DebugDraw.DrawString_s_color = new b2__namespace.Color(0.9, 0.6, 0.6);
  const g_debugDraw = new DebugDraw();
  const g_camera = new Camera();

  /*
  * Copyright (c) 2011 Erin Catto http://box2d.org
  *
  * This software is provided 'as-is', without any express or implied
  * warranty.  In no event will the authors be held liable for any damages
  * arising from the use of this software.
  * Permission is granted to anyone to use this software for any purpose,
  * including commercial applications, and to alter it and redistribute it
  * freely, subject to the following restrictions:
  * 1. The origin of this software must not be misrepresented; you must not
  * claim that you wrote the original software. If you use this software
  * in a product, an acknowledgment in the product documentation would be
  * appreciated but is not required.
  * 2. Altered source versions must be plainly marked as such, and must not be
  * misrepresented as being the original software.
  * 3. This notice may not be removed or altered from any source distribution.
  */
  var b2DrawFlags;
  (function (b2DrawFlags) {
      b2DrawFlags[b2DrawFlags["e_none"] = 0] = "e_none";
      b2DrawFlags[b2DrawFlags["e_shapeBit"] = 1] = "e_shapeBit";
      b2DrawFlags[b2DrawFlags["e_jointBit"] = 2] = "e_jointBit";
      b2DrawFlags[b2DrawFlags["e_aabbBit"] = 4] = "e_aabbBit";
      b2DrawFlags[b2DrawFlags["e_pairBit"] = 8] = "e_pairBit";
      b2DrawFlags[b2DrawFlags["e_centerOfMassBit"] = 16] = "e_centerOfMassBit";
      // #if B2_ENABLE_PARTICLE
      b2DrawFlags[b2DrawFlags["e_particleBit"] = 32] = "e_particleBit";
      // #endif
      // #if B2_ENABLE_CONTROLLER
      b2DrawFlags[b2DrawFlags["e_controllerBit"] = 64] = "e_controllerBit";
      // #endif
      b2DrawFlags[b2DrawFlags["e_all"] = 63] = "e_all";
  })(b2DrawFlags || (b2DrawFlags = {}));

  // MIT License
  const DRAW_STRING_NEW_LINE = 16;
  function RandomFloat(lo = -1, hi = 1) {
      let r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
  }
  class Test {
      constructor() {
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_pointCount = 0;
          this.m_bombSpawnPoint = new b2__namespace.Vec2();
          this.m_bombSpawning = false;
          this.m_mouseWorld = new b2__namespace.Vec2();
          this.m_stepCount = 0;
          this.m_maxProfile = new b2__namespace.Profile();
          this.m_totalProfile = new b2__namespace.Profile();
          const gravity = new b2__namespace.Vec2(0, -10);
          this.m_world = new b2__namespace.World(gravity);
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_world.SetDebugDraw(g_debugDraw);
          const bodyDef = new b2__namespace.BodyDef();
          this.m_groundBody = this.m_world.CreateBody(bodyDef);
      }
      Step(settings) {
          let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;
          if (settings.m_pause) {
              if (settings.m_singleStep) {
                  settings.m_singleStep = false;
              }
              else {
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
              const c = new b2__namespace.Color(0, 0, 1);
              g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
              c.SetRGB(0.8, 0.8, 0.8);
              g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
          }
      }
      GetDefaultViewZoom() {
          return 1.0;
      }
  }
  Test.k_maxContactPoints = 2048;
  Test.k_ParticleColors = [
      new b2__namespace.Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff),
      new b2__namespace.Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff),
      new b2__namespace.Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff), // cyan
  ];
  Test.k_ParticleColorsCount = Test.k_ParticleColors.length;

  // MIT License
  class Settings {
      constructor() {
          this.m_testIndex = 0;
          this.m_windowWidth = 1600;
          this.m_windowHeight = 900;
          this.m_hertz = 60;
          this.m_velocityIterations = 8;
          this.m_positionIterations = 3;
          // #if B2_ENABLE_PARTICLE
          // Particle iterations are needed for numerical stability in particle
          // simulations with small particles and relatively high gravity.
          // b2CalculateParticleIterations helps to determine the number.
          this.m_particleIterations = b2__namespace.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
          // #endif
          this.m_drawShapes = true;
          this.m_pause = false;
          this.m_singleStep = false;
          // #if B2_ENABLE_PARTICLE
          this.m_strictContacts = false;
      }
      // #endif
      Reset() {
          this.m_testIndex = 0;
          this.m_windowWidth = 1600;
          this.m_windowHeight = 900;
          this.m_hertz = 60;
          this.m_velocityIterations = 8;
          this.m_positionIterations = 3;
          // #if B2_ENABLE_PARTICLE
          // Particle iterations are needed for numerical stability in particle
          // simulations with small particles and relatively high gravity.
          // b2CalculateParticleIterations helps to determine the number.
          this.m_particleIterations = b2__namespace.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
          // #endif
          this.m_drawShapes = true;
          this.m_pause = false;
          this.m_singleStep = false;
          // #if B2_ENABLE_PARTICLE
          this.m_strictContacts = false;
          // #endif
      }
      Save() { }
      Load() { }
  }

  // MIT License
  class BoxStack extends Test {
      constructor() {
          super();
          this.m_bullet = null;
          this.m_bodies = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
          this.m_indices = new Array(BoxStack.e_rowCount * BoxStack.e_columnCount);
          {
              const bd = new b2__namespace.BodyDef();
              const ground = this.m_world.CreateBody(bd);
              const shape = new b2__namespace.EdgeShape();
              shape.SetTwoSided(new b2__namespace.Vec2(-40.0, 0.0), new b2__namespace.Vec2(40.0, 0.0));
              ground.CreateFixture(shape, 0.0);
              shape.SetTwoSided(new b2__namespace.Vec2(20.0, 0.0), new b2__namespace.Vec2(20.0, 20.0));
              ground.CreateFixture(shape, 0.0);
          }
          const xs = [0.0, -10.0, -5.0, 5.0, 10.0];
          for (let j = 0; j < BoxStack.e_columnCount; ++j) {
              const shape = new b2__namespace.PolygonShape();
              shape.SetAsBox(0.5, 0.5);
              const fd = new b2__namespace.FixtureDef();
              fd.shape = shape;
              fd.density = 1.0;
              fd.friction = 0.3;
              for (let i = 0; i < BoxStack.e_rowCount; ++i) {
                  const bd = new b2__namespace.BodyDef();
                  bd.type = b2__namespace.BodyType.b2_dynamicBody;
                  const n = j * BoxStack.e_rowCount + i;
                  // DEBUG: b2.Assert(n < BoxStack.e_rowCount * BoxStack.e_columnCount);
                  this.m_indices[n] = n;
                  bd.userData = this.m_indices[n];
                  const x = 0.0;
                  //const x = b2.RandomRange(-0.02, 0.02);
                  //const x = i % 2 === 0 ? -0.01 : 0.01;
                  bd.position.Set(xs[j] + x, 0.55 + 1.1 * i);
                  const body = this.m_world.CreateBody(bd);
                  this.m_bodies[n] = body;
                  body.CreateFixture(fd);
              }
          }
      }
      static Create() {
          return new BoxStack();
      }
  }
  BoxStack.e_columnCount = 1;
  BoxStack.e_rowCount = 15;

  // MIT License
  class Main {
      constructor(time) {
          this.m_time_last = 0;
          this.m_settings = new Settings();
          this.m_shift = false;
          this.m_demo_time = 0;
          this.m_ctx = null;
          document.body.style.backgroundColor = "rgba(51, 51, 51, 1.0)";
          const main_div = document.body.appendChild(document.createElement("div"));
          main_div.style.position = "absolute"; // relative to document.body
          main_div.style.left = "0px";
          main_div.style.top = "0px";
          function resize_main_div() {
              // console.log(window.innerWidth + "x" + window.innerHeight);
              main_div.style.width = window.innerWidth + "px";
              main_div.style.height = window.innerHeight + "px";
          }
          window.addEventListener("resize", (e) => { resize_main_div(); });
          window.addEventListener("orientationchange", (e) => { resize_main_div(); });
          resize_main_div();
          const view_div = main_div.appendChild(document.createElement("div"));
          const canvas_div = this.m_canvas_div = view_div.appendChild(document.createElement("div"));
          canvas_div.style.position = "absolute"; // relative to view_div
          canvas_div.style.left = "0px";
          canvas_div.style.right = "0px";
          canvas_div.style.top = "0px";
          canvas_div.style.bottom = "0px";
          const canvas_2d = this.m_canvas_2d = canvas_div.appendChild(document.createElement("canvas"));
          function resize_canvas() {
              ///console.log(canvas_div.clientWidth + "x" + canvas_div.clientHeight);
              if (canvas_2d.width !== canvas_div.clientWidth) {
                  g_camera.m_width = canvas_2d.width = canvas_div.clientWidth;
              }
              if (canvas_2d.height !== canvas_div.clientHeight) {
                  g_camera.m_height = canvas_2d.height = canvas_div.clientHeight;
              }
          }
          window.addEventListener("resize", (e) => { resize_canvas(); });
          window.addEventListener("orientationchange", (e) => { resize_canvas(); });
          resize_canvas();
          g_debugDraw.m_ctx = this.m_ctx = this.m_canvas_2d.getContext("2d");
          // simulation number inputs
          // draw checkbox inputs
          // simulation buttons
          // disable context menu to use right-click
          window.addEventListener("contextmenu", (e) => { e.preventDefault(); }, true);
          this.LoadTest();
          this.m_time_last = time;
      }
      HomeCamera() {
          g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
          g_camera.m_center.Set(0, 20 * g_camera.m_zoom);
          ///g_camera.m_roll.SetAngle(b2.DegToRad(0));
      }
      UpdateTest(time_elapsed) {
          this.m_demo_time += time_elapsed;
      }
      LoadTest(restartTest = false) {
          this.m_demo_time = 0;
          // #endif
          this.m_test = new BoxStack();
          if (!restartTest) {
              this.HomeCamera();
          }
      }
      SimulationLoop(time) {
          this.m_time_last = this.m_time_last || time;
          let time_elapsed = time - this.m_time_last;
          this.m_time_last = time;
          if (time_elapsed > 1000) {
              time_elapsed = 1000;
          }
          if (time_elapsed > 0) {
              const ctx = this.m_ctx;
              if (ctx) {
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  ctx.save();
                  ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                  ctx.scale(1, -1);
                  const s = 0.5 * g_camera.m_height / g_camera.m_extent;
                  ctx.scale(s, s);
                  ctx.lineWidth /= s;
                  ctx.scale(1 / g_camera.m_zoom, 1 / g_camera.m_zoom);
                  ctx.lineWidth *= g_camera.m_zoom;
                  ctx.translate(-g_camera.m_center.x, -g_camera.m_center.y);
                  if (this.m_test) {
                      this.m_test.Step(this.m_settings);
                  }
                  ctx.restore();
              }
              this.UpdateTest(time_elapsed);
          }
      }
  }

  exports.Camera = Camera;
  exports.DRAW_STRING_NEW_LINE = DRAW_STRING_NEW_LINE;
  exports.DebugDraw = DebugDraw;
  exports.Main = Main;
  exports.RandomFloat = RandomFloat;
  exports.Test = Test;
  exports.g_camera = g_camera;
  exports.g_debugDraw = g_debugDraw;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=testbed.umd.js.map
