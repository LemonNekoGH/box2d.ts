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
          // #if B2_ENABLE_PARTICLE
          this.m_drawParticles = true;
          // #endif
          this.m_drawJoints = true;
          this.m_drawAABBs = false;
          this.m_drawContactPoints = false;
          this.m_drawContactNormals = false;
          this.m_drawContactImpulse = false;
          this.m_drawFrictionImpulse = false;
          this.m_drawCOMs = false;
          this.m_drawControllers = true;
          this.m_drawStats = false;
          this.m_drawProfile = false;
          this.m_enableWarmStarting = true;
          this.m_enableContinuous = true;
          this.m_enableSubStepping = false;
          this.m_enableSleep = true;
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
          // #if B2_ENABLE_PARTICLE
          this.m_drawParticles = true;
          // #endif
          this.m_drawJoints = true;
          this.m_drawAABBs = false;
          this.m_drawContactPoints = false;
          this.m_drawContactNormals = false;
          this.m_drawContactImpulse = false;
          this.m_drawFrictionImpulse = false;
          this.m_drawCOMs = false;
          // #if B2_ENABLE_CONTROLLER
          this.m_drawControllers = true;
          // #endif
          this.m_drawStats = false;
          this.m_drawProfile = false;
          this.m_enableWarmStarting = true;
          this.m_enableContinuous = true;
          this.m_enableSubStepping = false;
          this.m_enableSleep = true;
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
  class Camera {
      constructor() {
          this.m_center = new b2__namespace.Vec2(0, 20);
          ///public readonly m_roll: b2.Rot = new b2.Rot(b2.DegToRad(0));
          this.m_extent = 25;
          this.m_zoom = 1;
          this.m_width = 1280;
          this.m_height = 800;
      }
      ConvertScreenToWorld(screenPoint, out) {
          return this.ConvertElementToWorld(screenPoint, out);
      }
      ConvertWorldToScreen(worldPoint, out) {
          return this.ConvertWorldToElement(worldPoint, out);
      }
      ConvertViewportToElement(viewport, out) {
          // 0,0 at center of canvas, x right and y up
          const element_x = viewport.x + (0.5 * this.m_width);
          const element_y = (0.5 * this.m_height) - viewport.y;
          return out.Set(element_x, element_y);
      }
      ConvertElementToViewport(element, out) {
          // 0,0 at center of canvas, x right and y up
          const viewport_x = element.x - (0.5 * this.m_width);
          const viewport_y = (0.5 * this.m_height) - element.y;
          return out.Set(viewport_x, viewport_y);
      }
      ConvertProjectionToViewport(projection, out) {
          const viewport = out.Copy(projection);
          b2__namespace.Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
          ///b2.Vec2.MulSV(this.m_extent, viewport, viewport);
          b2__namespace.Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
          return viewport;
      }
      ConvertViewportToProjection(viewport, out) {
          const projection = out.Copy(viewport);
          ///b2.Vec2.MulSV(1 / this.m_extent, projection, projection);
          b2__namespace.Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
          b2__namespace.Vec2.MulSV(this.m_zoom, projection, projection);
          return projection;
      }
      ConvertWorldToProjection(world, out) {
          const projection = out.Copy(world);
          b2__namespace.Vec2.SubVV(projection, this.m_center, projection);
          ///b2.Rot.MulTRV(this.m_roll, projection, projection);
          return projection;
      }
      ConvertProjectionToWorld(projection, out) {
          const world = out.Copy(projection);
          ///b2.Rot.MulRV(this.m_roll, world, world);
          b2__namespace.Vec2.AddVV(this.m_center, world, world);
          return world;
      }
      ConvertElementToWorld(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          const projection = this.ConvertViewportToProjection(viewport, out);
          return this.ConvertProjectionToWorld(projection, out);
      }
      ConvertWorldToElement(world, out) {
          const projection = this.ConvertWorldToProjection(world, out);
          const viewport = this.ConvertProjectionToViewport(projection, out);
          return this.ConvertViewportToElement(viewport, out);
      }
      ConvertElementToProjection(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          return this.ConvertViewportToProjection(viewport, out);
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
      DrawStringWorld(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              const p = DebugDraw.DrawStringWorld_s_p.Set(x, y);
              // world -> viewport
              const vt = g_camera.m_center;
              b2__namespace.Vec2.SubVV(p, vt, p);
              ///const vr = g_camera.m_roll;
              ///b2.Rot.MulTRV(vr, p, p);
              const vs = g_camera.m_zoom;
              b2__namespace.Vec2.MulSV(1 / vs, p, p);
              // viewport -> canvas
              const cs = 0.5 * g_camera.m_height / g_camera.m_extent;
              b2__namespace.Vec2.MulSV(cs, p, p);
              p.y *= -1;
              const cc = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
              b2__namespace.Vec2.AddVV(p, cc, p);
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawStringWorld_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, p.x, p.y);
              ctx.restore();
          }
      }
      DrawAABB(aabb, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.strokeStyle = color.MakeStyleString();
              const x = aabb.lowerBound.x;
              const y = aabb.lowerBound.y;
              const w = aabb.upperBound.x - aabb.lowerBound.x;
              const h = aabb.upperBound.y - aabb.lowerBound.y;
              ctx.strokeRect(x, y, w, h);
          }
      }
  }
  DebugDraw.DrawString_s_color = new b2__namespace.Color(0.9, 0.6, 0.6);
  DebugDraw.DrawStringWorld_s_p = new b2__namespace.Vec2();
  DebugDraw.DrawStringWorld_s_cc = new b2__namespace.Vec2();
  DebugDraw.DrawStringWorld_s_color = new b2__namespace.Color(0.5, 0.9, 0.5);
  const g_debugDraw = new DebugDraw();
  const g_camera = new Camera();

  /*
   * Copyright (c) 2014 Google, Inc.
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
  // #if B2_ENABLE_PARTICLE
  /**
   * Handles drawing and selection of full screen UI.
   */
  class FullScreenUI {
      constructor() {
          /**
           * Whether particle parameters are enabled.
           */
          this.m_particleParameterSelectionEnabled = false;
          this.Reset();
      }
      /**
       * Reset the UI to it's initial state.
       */
      Reset() {
          this.m_particleParameterSelectionEnabled = false;
      }
      /**
       * Enable / disable particle parameter selection.
       */
      SetParticleParameterSelectionEnabled(enable) {
          this.m_particleParameterSelectionEnabled = enable;
      }
      /**
       * Get whether particle parameter selection is enabled.
       */
      GetParticleParameterSelectionEnabled() {
          return this.m_particleParameterSelectionEnabled;
      }
  }
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  class EmittedParticleCallback {
      /**
       * Called for each created particle.
       */
      ParticleCreated(system, particleIndex) { }
  }
  /**
   * Emit particles from a circular region.
   */
  class RadialEmitter {
      constructor() {
          /**
           * Pointer to global world
           */
          this.m_particleSystem = null;
          /**
           * Called for each created particle.
           */
          this.m_callback = null;
          /**
           * Center of particle emitter
           */
          this.m_origin = new b2__namespace.Vec2();
          /**
           * Launch direction.
           */
          this.m_startingVelocity = new b2__namespace.Vec2();
          /**
           * Speed particles are emitted
           */
          this.m_speed = 0.0;
          /**
           * Half width / height of particle emitter
           */
          this.m_halfSize = new b2__namespace.Vec2();
          /**
           * Particles per second
           */
          this.m_emitRate = 1.0;
          /**
           * Initial color of particle emitted.
           */
          this.m_color = new b2__namespace.Color();
          /**
           * Number particles to emit on the next frame
           */
          this.m_emitRemainder = 0.0;
          /**
           * Flags for created particles, see b2ParticleFlag.
           */
          this.m_flags = b2__namespace.ParticleFlag.b2_waterParticle;
          /**
           * Group to put newly created particles in.
           */
          this.m_group = null;
      }
      /**
       * Calculate a random number 0.0..1.0.
       */
      static Random() {
          return Math.random();
      }
      __dtor__() {
          this.SetGroup(null);
      }
      /**
       * Set the center of the emitter.
       */
      SetPosition(origin) {
          this.m_origin.Copy(origin);
      }
      /**
       * Get the center of the emitter.
       */
      GetPosition(out) {
          return out.Copy(this.m_origin);
      }
      /**
       * Set the size of the circle which emits particles.
       */
      SetSize(size) {
          this.m_halfSize.Copy(size).SelfMul(0.5);
      }
      /**
       * Get the size of the circle which emits particles.
       */
      GetSize(out) {
          return out.Copy(this.m_halfSize).SelfMul(2.0);
      }
      /**
       * Set the starting velocity of emitted particles.
       */
      SetVelocity(velocity) {
          this.m_startingVelocity.Copy(velocity);
      }
      /**
       * Get the starting velocity.
       */
      GetVelocity(out) {
          return out.Copy(this.m_startingVelocity);
      }
      /**
       * Set the speed of particles along the direction from the
       * center of the emitter.
       */
      SetSpeed(speed) {
          this.m_speed = speed;
      }
      /**
       * Get the speed of particles along the direction from the
       * center of the emitter.
       */
      GetSpeed() {
          return this.m_speed;
      }
      /**
       * Set the flags for created particles.
       */
      SetParticleFlags(flags) {
          this.m_flags = flags;
      }
      /**
       * Get the flags for created particles.
       */
      GetParticleFlags() {
          return this.m_flags;
      }
      /**
       * Set the color of particles.
       */
      SetColor(color) {
          this.m_color.Copy(color);
      }
      /**
       * Get the color of particles emitter.
       */
      GetColor(out) {
          return out.Copy(this.m_color);
      }
      /**
       * Set the emit rate in particles per second.
       */
      SetEmitRate(emitRate) {
          this.m_emitRate = emitRate;
      }
      /**
       * Get the current emit rate.
       */
      GetEmitRate() {
          return this.m_emitRate;
      }
      /**
       * Set the particle system this emitter is adding particles to.
       */
      SetParticleSystem(particleSystem) {
          this.m_particleSystem = particleSystem;
      }
      /**
       * Get the particle system this emitter is adding particle to.
       */
      GetParticleSystem() {
          return this.m_particleSystem;
      }
      /**
       * Set the callback that is called on the creation of each
       * particle.
       */
      SetCallback(callback) {
          this.m_callback = callback;
      }
      /**
       * Get the callback that is called on the creation of each
       * particle.
       */
      GetCallback() {
          return this.m_callback;
      }
      /**
       * This class sets the group flags to b2_particleGroupCanBeEmpty
       * so that it isn't destroyed and clears the
       * b2_particleGroupCanBeEmpty on the group when the emitter no
       * longer references it so that the group can potentially be
       * cleaned up.
       */
      SetGroup(group) {
          if (this.m_group) {
              this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() & ~b2__namespace.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
          }
          this.m_group = group;
          if (this.m_group) {
              this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() | b2__namespace.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
          }
      }
      /**
       * Get the group particles should be created within.
       */
      GetGroup() {
          return this.m_group;
      }
      /**
       * dt is seconds that have passed, particleIndices is an
       * optional pointer to an array which tracks which particles
       * have been created and particleIndicesCount is the size of the
       * particleIndices array. This function returns the number of
       * particles created during this simulation step.
       */
      Step(dt, particleIndices, particleIndicesCount = particleIndices ? particleIndices.length : 0) {
          if (this.m_particleSystem === null) {
              throw new Error();
          }
          let numberOfParticlesCreated = 0;
          // How many (fractional) particles should we have emitted this frame?
          this.m_emitRemainder += this.m_emitRate * dt;
          const pd = new b2__namespace.ParticleDef();
          pd.color.Copy(this.m_color);
          pd.flags = this.m_flags;
          pd.group = this.m_group;
          // Keep emitting particles on this frame until we only have a
          // fractional particle left.
          while (this.m_emitRemainder > 1.0) {
              this.m_emitRemainder -= 1.0;
              // Randomly pick a position within the emitter's radius.
              const angle = RadialEmitter.Random() * 2.0 * b2__namespace.pi;
              // Distance from the center of the circle.
              const distance = RadialEmitter.Random();
              const positionOnUnitCircle = new b2__namespace.Vec2(Math.sin(angle), Math.cos(angle));
              // Initial position.
              pd.position.Set(this.m_origin.x + positionOnUnitCircle.x * distance * this.m_halfSize.x, this.m_origin.y + positionOnUnitCircle.y * distance * this.m_halfSize.y);
              // Send it flying
              pd.velocity.Copy(this.m_startingVelocity);
              if (this.m_speed !== 0.0) {
                  ///  pd.velocity += positionOnUnitCircle * m_speed;
                  pd.velocity.SelfMulAdd(this.m_speed, positionOnUnitCircle);
              }
              const particleIndex = this.m_particleSystem.CreateParticle(pd);
              if (this.m_callback) {
                  this.m_callback.ParticleCreated(this.m_particleSystem, particleIndex);
              }
              if (particleIndices && (numberOfParticlesCreated < particleIndicesCount)) {
                  particleIndices[numberOfParticlesCreated] = particleIndex;
              }
              ++numberOfParticlesCreated;
          }
          return numberOfParticlesCreated;
      }
  }
  // #endif

  /*
   * Copyright (c) 2014 Google, Inc.
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
  exports.ParticleParameterOptions = void 0;
  (function (ParticleParameterOptions) {
      ParticleParameterOptions[ParticleParameterOptions["OptionStrictContacts"] = 1] = "OptionStrictContacts";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawShapes"] = 2] = "OptionDrawShapes";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawParticles"] = 4] = "OptionDrawParticles";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawJoints"] = 8] = "OptionDrawJoints";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawAABBs"] = 16] = "OptionDrawAABBs";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactPoints"] = 32] = "OptionDrawContactPoints";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactNormals"] = 64] = "OptionDrawContactNormals";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawContactImpulse"] = 128] = "OptionDrawContactImpulse";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawFrictionImpulse"] = 256] = "OptionDrawFrictionImpulse";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawCOMs"] = 512] = "OptionDrawCOMs";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawStats"] = 1024] = "OptionDrawStats";
      ParticleParameterOptions[ParticleParameterOptions["OptionDrawProfile"] = 2048] = "OptionDrawProfile";
  })(exports.ParticleParameterOptions || (exports.ParticleParameterOptions = {}));
  class ParticleParameterValue {
      constructor(...args) {
          /**
           * ParticleParameterValue associated with the parameter.
           */
          this.value = 0;
          /**
           * Any global (non particle-specific) options associated with
           * this parameter
           */
          this.options = 0;
          /**
           * Name to display when this parameter is selected.
           */
          this.name = "";
          if (args[0] instanceof ParticleParameterValue) {
              this.Copy(args[0]);
          }
          else {
              this.value = args[0];
              this.options = args[1];
              this.name = args[2];
          }
      }
      Copy(other) {
          this.value = other.value;
          this.options = other.options;
          this.name = other.name;
          return this;
      }
  }
  class ParticleParameterDefinition {
      /**
       * Particle parameter definition.
       */
      constructor(values, numValues = values.length) {
          this.numValues = 0;
          this.values = values;
          this.numValues = numValues;
      }
      CalculateValueMask() {
          let mask = 0;
          for (let i = 0; i < this.numValues; i++) {
              mask |= this.values[i].value;
          }
          return mask;
      }
  }
  class ParticleParameter {
      constructor() {
          this.m_index = 0;
          this.m_changed = false;
          this.m_restartOnChange = false;
          this.m_value = null;
          this.m_definition = ParticleParameter.k_defaultDefinition;
          this.m_definitionCount = 0;
          this.m_valueCount = 0;
          this.Reset();
      }
      Reset() {
          this.m_restartOnChange = true;
          this.m_index = 0;
          this.SetDefinition(ParticleParameter.k_defaultDefinition);
          this.Set(0);
      }
      SetDefinition(definition, definitionCount = definition.length) {
          this.m_definition = definition;
          this.m_definitionCount = definitionCount;
          this.m_valueCount = 0;
          for (let i = 0; i < this.m_definitionCount; ++i) {
              this.m_valueCount += this.m_definition[i].numValues;
          }
          // Refresh the selected value.
          this.Set(this.Get());
      }
      Get() {
          return this.m_index;
      }
      Set(index) {
          this.m_changed = this.m_index !== index;
          this.m_index = this.m_valueCount ? index % this.m_valueCount : index;
          this.m_value = this.FindParticleParameterValue();
          // DEBUG: b2.Assert(this.m_value !== null);
      }
      Increment() {
          const index = this.Get();
          this.Set(index >= this.m_valueCount ? 0 : index + 1);
      }
      Decrement() {
          const index = this.Get();
          this.Set(index === 0 ? this.m_valueCount - 1 : index - 1);
      }
      Changed(restart) {
          const changed = this.m_changed;
          this.m_changed = false;
          if (restart) {
              restart[0] = changed && this.GetRestartOnChange();
          }
          return changed;
      }
      GetValue() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.value;
      }
      GetName() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.name;
      }
      GetOptions() {
          if (this.m_value === null) {
              throw new Error();
          }
          return this.m_value.options;
      }
      SetRestartOnChange(enable) {
          this.m_restartOnChange = enable;
      }
      GetRestartOnChange() {
          return this.m_restartOnChange;
      }
      FindIndexByValue(value) {
          let index = 0;
          for (let i = 0; i < this.m_definitionCount; ++i) {
              const definition = this.m_definition[i];
              const numValues = definition.numValues;
              for (let j = 0; j < numValues; ++j, ++index) {
                  if (definition.values[j].value === value) {
                      return index;
                  }
              }
          }
          return -1;
      }
      FindParticleParameterValue() {
          let start = 0;
          const index = this.Get();
          for (let i = 0; i < this.m_definitionCount; ++i) {
              const definition = this.m_definition[i];
              const end = start + definition.numValues;
              if (index >= start && index < end) {
                  return definition.values[index - start];
              }
              start = end;
          }
          return null;
      }
  }
  ParticleParameter.k_DefaultOptions = exports.ParticleParameterOptions.OptionDrawShapes | exports.ParticleParameterOptions.OptionDrawParticles;
  ParticleParameter.k_particleTypes = [
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions, "water"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_springParticle, ParticleParameter.k_DefaultOptions, "spring"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_elasticParticle, ParticleParameter.k_DefaultOptions, "elastic"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_viscousParticle, ParticleParameter.k_DefaultOptions, "viscous"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_powderParticle, ParticleParameter.k_DefaultOptions, "powder"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_tensileParticle, ParticleParameter.k_DefaultOptions, "tensile"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_colorMixingParticle, ParticleParameter.k_DefaultOptions, "color mixing"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "wall"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_barrierParticle | b2__namespace.ParticleFlag.b2_wallParticle, ParticleParameter.k_DefaultOptions, "barrier"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_staticPressureParticle, ParticleParameter.k_DefaultOptions, "static pressure"),
      new ParticleParameterValue(b2__namespace.ParticleFlag.b2_waterParticle, ParticleParameter.k_DefaultOptions | exports.ParticleParameterOptions.OptionDrawAABBs, "water (bounding boxes)"),
  ];
  ParticleParameter.k_defaultDefinition = [
      new ParticleParameterDefinition(ParticleParameter.k_particleTypes),
  ];
  // #endif

  // MIT License
  // #endif
  const DRAW_STRING_NEW_LINE = 16;
  function RandomFloat(lo = -1, hi = 1) {
      let r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
  }
  class TestEntry {
      constructor(category, name, createFcn) {
          this.category = "";
          this.name = "unknown";
          this.category = category;
          this.name = name;
          this.createFcn = createFcn;
      }
  }
  const g_testEntries = [];
  function RegisterTest(category, name, fcn) {
      return g_testEntries.push(new TestEntry(category, name, fcn));
  }
  class DestructionListener extends b2__namespace.DestructionListener {
      constructor(test) {
          super();
          this.test = test;
      }
      SayGoodbyeJoint(joint) {
          if (this.test.m_mouseJoint === joint) {
              this.test.m_mouseJoint = null;
          }
          else {
              this.test.JointDestroyed(joint);
          }
      }
      SayGoodbyeFixture(fixture) { }
      // #if B2_ENABLE_PARTICLE
      SayGoodbyeParticleGroup(group) {
          this.test.ParticleGroupDestroyed(group);
      }
  }
  class ContactPoint {
      constructor() {
          this.normal = new b2__namespace.Vec2();
          this.position = new b2__namespace.Vec2();
          this.state = b2__namespace.PointState.b2_nullState;
          this.normalImpulse = 0;
          this.tangentImpulse = 0;
          this.separation = 0;
      }
  }
  // #if B2_ENABLE_PARTICLE
  class QueryCallback2 extends b2__namespace.QueryCallback {
      constructor(particleSystem, shape, velocity) {
          super();
          this.m_particleSystem = particleSystem;
          this.m_shape = shape;
          this.m_velocity = velocity;
      }
      ReportFixture(fixture) {
          return false;
      }
      ReportParticle(particleSystem, index) {
          if (particleSystem !== this.m_particleSystem) {
              return false;
          }
          const xf = b2__namespace.Transform.IDENTITY;
          const p = this.m_particleSystem.GetPositionBuffer()[index];
          if (this.m_shape.TestPoint(xf, p)) {
              const v = this.m_particleSystem.GetVelocityBuffer()[index];
              v.Copy(this.m_velocity);
          }
          return true;
      }
  }
  // #endif
  class Test extends b2__namespace.ContactListener {
      // #endif
      constructor() {
          super();
          // #endif
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_points = b2__namespace.MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
          this.m_pointCount = 0;
          this.m_bombSpawnPoint = new b2__namespace.Vec2();
          this.m_bombSpawning = false;
          this.m_mouseWorld = new b2__namespace.Vec2();
          // #if B2_ENABLE_PARTICLE
          this.m_mouseTracing = false;
          this.m_mouseTracerPosition = new b2__namespace.Vec2();
          this.m_mouseTracerVelocity = new b2__namespace.Vec2();
          // #endif
          this.m_stepCount = 0;
          this.m_maxProfile = new b2__namespace.Profile();
          this.m_totalProfile = new b2__namespace.Profile();
          // #if B2_ENABLE_PARTICLE
          this.m_particleParameters = null;
          this.m_particleParameterDef = null;
          // #if B2_ENABLE_PARTICLE
          const particleSystemDef = new b2__namespace.ParticleSystemDef();
          // #endif
          const gravity = new b2__namespace.Vec2(0, -10);
          this.m_world = new b2__namespace.World(gravity);
          // #if B2_ENABLE_PARTICLE
          this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
          // #endif
          this.m_bomb = null;
          this.m_textLine = 30;
          this.m_mouseJoint = null;
          this.m_destructionListener = new DestructionListener(this);
          this.m_world.SetDestructionListener(this.m_destructionListener);
          this.m_world.SetContactListener(this);
          this.m_world.SetDebugDraw(g_debugDraw);
          // #if B2_ENABLE_PARTICLE
          this.m_particleSystem.SetGravityScale(0.4);
          this.m_particleSystem.SetDensity(1.2);
          // #endif
          const bodyDef = new b2__namespace.BodyDef();
          this.m_groundBody = this.m_world.CreateBody(bodyDef);
      }
      JointDestroyed(joint) { }
      // #if B2_ENABLE_PARTICLE
      ParticleGroupDestroyed(group) { }
      // #endif
      BeginContact(contact) { }
      EndContact(contact) { }
      PreSolve(contact, oldManifold) {
          const manifold = contact.GetManifold();
          if (manifold.pointCount === 0) {
              return;
          }
          const fixtureA = contact.GetFixtureA();
          const fixtureB = contact.GetFixtureB();
          const state1 = Test.PreSolve_s_state1;
          const state2 = Test.PreSolve_s_state2;
          b2__namespace.GetPointStates(state1, state2, oldManifold, manifold);
          const worldManifold = Test.PreSolve_s_worldManifold;
          contact.GetWorldManifold(worldManifold);
          for (let i = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
              const cp = this.m_points[this.m_pointCount];
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
      PostSolve(contact, impulse) { }
      Keyboard(key) { }
      KeyboardUp(key) { }
      SetTextLine(line) {
          this.m_textLine = line;
      }
      DrawTitle(title) {
          g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
          this.m_textLine = 3 * DRAW_STRING_NEW_LINE;
      }
      MouseDown(p) {
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
          let hit_fixture = null; // HACK: tsc doesn't detect calling callbacks
          // Query the world for overlapping shapes.
          this.m_world.QueryPointAABB(p, (fixture) => {
              const body = fixture.GetBody();
              if (body.GetType() === b2__namespace.BodyType.b2_dynamicBody) {
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
              const jd = new b2__namespace.MouseJointDef();
              jd.bodyA = this.m_groundBody;
              jd.bodyB = body;
              jd.target.Copy(p);
              jd.maxForce = 1000 * body.GetMass();
              b2__namespace.LinearStiffness(jd, frequencyHz, dampingRatio, jd.bodyA, jd.bodyB);
              this.m_mouseJoint = this.m_world.CreateJoint(jd);
              body.SetAwake(true);
          }
      }
      SpawnBomb(worldPt) {
          this.m_bombSpawnPoint.Copy(worldPt);
          this.m_bombSpawning = true;
      }
      CompleteBombSpawn(p) {
          if (!this.m_bombSpawning) {
              return;
          }
          const multiplier = 30;
          const vel = b2__namespace.Vec2.SubVV(this.m_bombSpawnPoint, p, new b2__namespace.Vec2());
          vel.SelfMul(multiplier);
          this.LaunchBombAt(this.m_bombSpawnPoint, vel);
          this.m_bombSpawning = false;
      }
      ShiftMouseDown(p) {
          this.m_mouseWorld.Copy(p);
          if (this.m_mouseJoint !== null) {
              return;
          }
          this.SpawnBomb(p);
      }
      MouseUp(p) {
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
      MouseMove(p) {
          this.m_mouseWorld.Copy(p);
          if (this.m_mouseJoint) {
              this.m_mouseJoint.SetTarget(p);
          }
      }
      LaunchBomb() {
          const p = new b2__namespace.Vec2(b2__namespace.RandomRange(-15, 15), 30);
          const v = b2__namespace.Vec2.MulSV(-5, p, new b2__namespace.Vec2());
          this.LaunchBombAt(p, v);
      }
      LaunchBombAt(position, velocity) {
          if (this.m_bomb) {
              this.m_world.DestroyBody(this.m_bomb);
              this.m_bomb = null;
          }
          const bd = new b2__namespace.BodyDef();
          bd.type = b2__namespace.BodyType.b2_dynamicBody;
          bd.position.Copy(position);
          bd.bullet = true;
          this.m_bomb = this.m_world.CreateBody(bd);
          this.m_bomb.SetLinearVelocity(velocity);
          const circle = new b2__namespace.CircleShape();
          circle.m_radius = 0.3;
          const fd = new b2__namespace.FixtureDef();
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
          let flags = b2__namespace.DrawFlags.e_none;
          if (settings.m_drawShapes) {
              flags |= b2__namespace.DrawFlags.e_shapeBit;
          }
          // #if B2_ENABLE_PARTICLE
          if (settings.m_drawParticles) {
              flags |= b2__namespace.DrawFlags.e_particleBit;
          }
          // #endif
          if (settings.m_drawJoints) {
              flags |= b2__namespace.DrawFlags.e_jointBit;
          }
          if (settings.m_drawAABBs) {
              flags |= b2__namespace.DrawFlags.e_aabbBit;
          }
          if (settings.m_drawCOMs) {
              flags |= b2__namespace.DrawFlags.e_centerOfMassBit;
          }
          // #if B2_ENABLE_CONTROLLER
          if (settings.m_drawControllers) {
              flags |= b2__namespace.DrawFlags.e_controllerBit;
          }
          // #endif
          g_debugDraw.SetFlags(flags);
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
          if (settings.m_drawStats) {
              const bodyCount = this.m_world.GetBodyCount();
              const contactCount = this.m_world.GetContactCount();
              const jointCount = this.m_world.GetJointCount();
              g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // #if B2_ENABLE_PARTICLE
              const particleCount = this.m_particleSystem.GetParticleCount();
              const groupCount = this.m_particleSystem.GetParticleGroupCount();
              const pairCount = this.m_particleSystem.GetPairCount();
              const triadCount = this.m_particleSystem.GetTriadCount();
              g_debugDraw.DrawString(5, this.m_textLine, "particles/groups/pairs/triads = " + particleCount + "/" + groupCount + "/" + pairCount + "/" + triadCount);
              this.m_textLine += DRAW_STRING_NEW_LINE;
              // #endif
              const proxyCount = this.m_world.GetProxyCount();
              const height = this.m_world.GetTreeHeight();
              const balance = this.m_world.GetTreeBalance();
              const quality = this.m_world.GetTreeQuality();
              g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          // Track maximum profile times
          {
              const p = this.m_world.GetProfile();
              this.m_maxProfile.step = b2__namespace.Max(this.m_maxProfile.step, p.step);
              this.m_maxProfile.collide = b2__namespace.Max(this.m_maxProfile.collide, p.collide);
              this.m_maxProfile.solve = b2__namespace.Max(this.m_maxProfile.solve, p.solve);
              this.m_maxProfile.solveInit = b2__namespace.Max(this.m_maxProfile.solveInit, p.solveInit);
              this.m_maxProfile.solveVelocity = b2__namespace.Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
              this.m_maxProfile.solvePosition = b2__namespace.Max(this.m_maxProfile.solvePosition, p.solvePosition);
              this.m_maxProfile.solveTOI = b2__namespace.Max(this.m_maxProfile.solveTOI, p.solveTOI);
              this.m_maxProfile.broadphase = b2__namespace.Max(this.m_maxProfile.broadphase, p.broadphase);
              this.m_totalProfile.step += p.step;
              this.m_totalProfile.collide += p.collide;
              this.m_totalProfile.solve += p.solve;
              this.m_totalProfile.solveInit += p.solveInit;
              this.m_totalProfile.solveVelocity += p.solveVelocity;
              this.m_totalProfile.solvePosition += p.solvePosition;
              this.m_totalProfile.solveTOI += p.solveTOI;
              this.m_totalProfile.broadphase += p.broadphase;
          }
          if (settings.m_drawProfile) {
              const p = this.m_world.GetProfile();
              const aveProfile = new b2__namespace.Profile();
              if (this.m_stepCount > 0) {
                  const scale = 1 / this.m_stepCount;
                  aveProfile.step = scale * this.m_totalProfile.step;
                  aveProfile.collide = scale * this.m_totalProfile.collide;
                  aveProfile.solve = scale * this.m_totalProfile.solve;
                  aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
                  aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
                  aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
                  aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
                  aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
              }
              g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
              g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
              this.m_textLine += DRAW_STRING_NEW_LINE;
          }
          // #if B2_ENABLE_PARTICLE
          if (this.m_mouseTracing && !this.m_mouseJoint) {
              const delay = 0.1;
              ///b2Vec2 acceleration = 2 / delay * (1 / delay * (m_mouseWorld - m_mouseTracerPosition) - m_mouseTracerVelocity);
              const acceleration = new b2__namespace.Vec2();
              acceleration.x = 2 / delay * (1 / delay * (this.m_mouseWorld.x - this.m_mouseTracerPosition.x) - this.m_mouseTracerVelocity.x);
              acceleration.y = 2 / delay * (1 / delay * (this.m_mouseWorld.y - this.m_mouseTracerPosition.y) - this.m_mouseTracerVelocity.y);
              ///m_mouseTracerVelocity += timeStep * acceleration;
              this.m_mouseTracerVelocity.SelfMulAdd(timeStep, acceleration);
              ///m_mouseTracerPosition += timeStep * m_mouseTracerVelocity;
              this.m_mouseTracerPosition.SelfMulAdd(timeStep, this.m_mouseTracerVelocity);
              const shape = new b2__namespace.CircleShape();
              shape.m_p.Copy(this.m_mouseTracerPosition);
              shape.m_radius = 2 * this.GetDefaultViewZoom();
              ///QueryCallback2 callback(m_particleSystem, &shape, m_mouseTracerVelocity);
              const callback = new QueryCallback2(this.m_particleSystem, shape, this.m_mouseTracerVelocity);
              const aabb = new b2__namespace.AABB();
              const xf = new b2__namespace.Transform();
              xf.SetIdentity();
              shape.ComputeAABB(aabb, xf, 0);
              this.m_world.QueryAABB(callback, aabb);
          }
          // #endif
          if (this.m_bombSpawning) {
              const c = new b2__namespace.Color(0, 0, 1);
              g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
              c.SetRGB(0.8, 0.8, 0.8);
              g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
          }
          if (settings.m_drawContactPoints) {
              const k_impulseScale = 0.1;
              const k_axisScale = 0.3;
              for (let i = 0; i < this.m_pointCount; ++i) {
                  const point = this.m_points[i];
                  if (point.state === b2__namespace.PointState.b2_addState) {
                      // Add
                      g_debugDraw.DrawPoint(point.position, 10, new b2__namespace.Color(0.3, 0.95, 0.3));
                  }
                  else if (point.state === b2__namespace.PointState.b2_persistState) {
                      // Persist
                      g_debugDraw.DrawPoint(point.position, 5, new b2__namespace.Color(0.3, 0.3, 0.95));
                  }
                  if (settings.m_drawContactNormals) {
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVV(p1, b2__namespace.Vec2.MulSV(k_axisScale, point.normal, b2__namespace.Vec2.s_t0), new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.9));
                  }
                  else if (settings.m_drawContactImpulse) {
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.3));
                  }
                  if (settings.m_drawFrictionImpulse) {
                      const tangent = b2__namespace.Vec2.CrossVOne(point.normal, new b2__namespace.Vec2());
                      const p1 = point.position;
                      const p2 = b2__namespace.Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new b2__namespace.Vec2());
                      g_debugDraw.DrawSegment(p1, p2, new b2__namespace.Color(0.9, 0.9, 0.3));
                  }
              }
          }
      }
      ShiftOrigin(newOrigin) {
          this.m_world.ShiftOrigin(newOrigin);
      }
      GetDefaultViewZoom() {
          return 1.0;
      }
      /**
       * Apply a preset range of colors to a particle group.
       *
       * A different color out of k_ParticleColors is applied to each
       * particlesPerColor particles in the specified group.
       *
       * If particlesPerColor is 0, the particles in the group are
       * divided into k_ParticleColorsCount equal sets of colored
       * particles.
       */
      ColorParticleGroup(group, particlesPerColor) {
          // DEBUG: b2.Assert(group !== null);
          const colorBuffer = this.m_particleSystem.GetColorBuffer();
          const particleCount = group.GetParticleCount();
          const groupStart = group.GetBufferIndex();
          const groupEnd = particleCount + groupStart;
          const colorCount = Test.k_ParticleColors.length;
          if (!particlesPerColor) {
              particlesPerColor = Math.floor(particleCount / colorCount);
              if (!particlesPerColor) {
                  particlesPerColor = 1;
              }
          }
          for (let i = groupStart; i < groupEnd; i++) {
              ///colorBuffer[i].Copy(box2d.Testbed.Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount]);
              colorBuffer[i] = Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount].Clone();
          }
      }
      /**
       * Remove particle parameters matching "filterMask" from the set
       * of particle parameters available for this test.
       */
      InitializeParticleParameters(filterMask) {
          const defaultNumValues = ParticleParameter.k_defaultDefinition[0].numValues;
          const defaultValues = ParticleParameter.k_defaultDefinition[0].values;
          ///  m_particleParameters = new ParticleParameter::Value[defaultNumValues];
          this.m_particleParameters = [];
          // Disable selection of wall and barrier particle types.
          let numValues = 0;
          for (let i = 0; i < defaultNumValues; i++) {
              if (defaultValues[i].value & filterMask) {
                  continue;
              }
              ///memcpy(&m_particleParameters[numValues], &defaultValues[i], sizeof(defaultValues[0]));
              this.m_particleParameters[numValues] = new ParticleParameterValue(defaultValues[i]);
              numValues++;
          }
          this.m_particleParameterDef = new ParticleParameterDefinition(this.m_particleParameters, numValues);
          ///m_particleParameterDef.values = m_particleParameters;
          ///m_particleParameterDef.numValues = numValues;
          Test.SetParticleParameters([this.m_particleParameterDef], 1);
      }
      /**
       * Restore default particle parameters.
       */
      RestoreParticleParameters() {
          if (this.m_particleParameters) {
              Test.SetParticleParameters(ParticleParameter.k_defaultDefinition, 1);
              ///  delete [] m_particleParameters;
              this.m_particleParameters = null;
          }
      }
      /**
       * Set whether to restart the test on particle parameter
       * changes. This parameter is re-enabled when the test changes.
       */
      static SetRestartOnParticleParameterChange(enable) {
          Test.particleParameter.SetRestartOnChange(enable);
      }
      /**
       * Set the currently selected particle parameter value.  This
       * value must match one of the values in
       * Main::k_particleTypes or one of the values referenced by
       * particleParameterDef passed to SetParticleParameters().
       */
      static SetParticleParameterValue(value) {
          const index = Test.particleParameter.FindIndexByValue(value);
          // If the particle type isn't found, so fallback to the first entry in the
          // parameter.
          Test.particleParameter.Set(index >= 0 ? index : 0);
          return Test.particleParameter.GetValue();
      }
      /**
       * Get the currently selected particle parameter value and
       * enable particle parameter selection arrows on Android.
       */
      static GetParticleParameterValue() {
          // Enable display of particle type selection arrows.
          Test.fullscreenUI.SetParticleParameterSelectionEnabled(true);
          return Test.particleParameter.GetValue();
      }
      /**
       * Override the default particle parameters for the test.
       */
      static SetParticleParameters(particleParameterDef, particleParameterDefCount = particleParameterDef.length) {
          Test.particleParameter.SetDefinition(particleParameterDef, particleParameterDefCount);
      }
  }
  // #if B2_ENABLE_PARTICLE
  Test.fullscreenUI = new FullScreenUI();
  Test.particleParameter = new ParticleParameter();
  // #endif
  Test.k_maxContactPoints = 2048;
  Test.PreSolve_s_state1 = [ /*b2.maxManifoldPoints*/];
  Test.PreSolve_s_state2 = [ /*b2.maxManifoldPoints*/];
  Test.PreSolve_s_worldManifold = new b2__namespace.WorldManifold();
  // #if B2_ENABLE_PARTICLE
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
      Keyboard(key) {
          switch (key) {
              case ",":
                  if (this.m_bullet) {
                      this.m_world.DestroyBody(this.m_bullet);
                      this.m_bullet = null;
                  }
                  {
                      const shape = new b2__namespace.CircleShape();
                      shape.m_radius = 0.25;
                      const fd = new b2__namespace.FixtureDef();
                      fd.shape = shape;
                      fd.density = 20.0;
                      fd.restitution = 0.05;
                      const bd = new b2__namespace.BodyDef();
                      bd.type = b2__namespace.BodyType.b2_dynamicBody;
                      bd.bullet = true;
                      bd.position.Set(-31.0, 5.0);
                      this.m_bullet = this.m_world.CreateBody(bd);
                      this.m_bullet.CreateFixture(fd);
                      this.m_bullet.SetLinearVelocity(new b2__namespace.Vec2(400.0, 0.0));
                  }
                  break;
              case "b":
                  b2__namespace.set_g_blockSolve(!b2__namespace.get_g_blockSolve());
                  break;
          }
      }
      Step(settings) {
          super.Step(settings);
          g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
          this.m_textLine += DRAW_STRING_NEW_LINE;
          // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(b2.blockSolve) ? (1) : (0)}`);
          //if (this.m_stepCount === 300)
          //{
          //  if (this.m_bullet !== null)
          //  {
          //    this.m_world.DestroyBody(this.m_bullet);
          //    this.m_bullet = null;
          //  }
          //  {
          //    const shape = new b2.CircleShape();
          //    shape.m_radius = 0.25;
          //    const fd = new b2.FixtureDef();
          //    fd.shape = shape;
          //    fd.density = 20.0;
          //    fd.restitution = 0.05;
          //    const bd = new b2.BodyDef();
          //    bd.type = b2.BodyType.b2_dynamicBody;
          //    bd.bullet = true;
          //    bd.position.Set(-31.0, 5.0);
          //    this.m_bullet = this.m_world.CreateBody(bd);
          //    this.m_bullet.CreateFixture(fd);
          //    this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
          //  }
          //}
      }
      static Create() {
          return new BoxStack();
      }
  }
  BoxStack.e_columnCount = 1;
  BoxStack.e_rowCount = 15;
  RegisterTest("Stacking", "Boxes", BoxStack.Create);

  // MIT License
  class Main {
      constructor(time) {
          this.m_time_last = 0;
          this.m_fps_time = 0;
          this.m_fps_frames = 0;
          this.m_fps = 0;
          this.m_settings = new Settings();
          this.m_shift = false;
          this.m_ctrl = false;
          this.m_lMouseDown = false;
          this.m_rMouseDown = false;
          this.m_projection0 = new b2__namespace.Vec2();
          this.m_viewCenter0 = new b2__namespace.Vec2();
          this.m_demo_mode = false;
          this.m_demo_time = 0;
          this.m_max_demo_time = 1000 * 10;
          this.m_ctx = null;
          this.m_mouse = new b2__namespace.Vec2();
          const fps_div = this.m_fps_div = document.body.appendChild(document.createElement("div"));
          fps_div.style.position = "absolute";
          fps_div.style.left = "0px";
          fps_div.style.bottom = "0px";
          fps_div.style.backgroundColor = "rgba(0,0,255,0.75)";
          fps_div.style.color = "white";
          fps_div.style.font = "10pt Courier New";
          fps_div.style.zIndex = "256";
          fps_div.innerHTML = "FPS";
          const debug_div = this.m_debug_div = document.body.appendChild(document.createElement("div"));
          debug_div.style.position = "absolute";
          debug_div.style.left = "0px";
          debug_div.style.bottom = "0px";
          debug_div.style.backgroundColor = "rgba(0,0,255,0.75)";
          debug_div.style.color = "white";
          debug_div.style.font = "10pt Courier New";
          debug_div.style.zIndex = "256";
          debug_div.innerHTML = "";
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
          const title_div = main_div.appendChild(document.createElement("div"));
          title_div.style.textAlign = "center";
          title_div.style.color = "grey";
          title_div.innerHTML = "Box2D Testbed version " + b2__namespace.version.toString();
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
          const controls_div = view_div.appendChild(document.createElement("div"));
          controls_div.style.position = "absolute"; // relative to view_div
          controls_div.style.backgroundColor = "rgba(255,255,255,0.5)";
          controls_div.style.padding = "8px";
          controls_div.style.right = "0px";
          controls_div.style.top = "0px";
          controls_div.style.bottom = "0px";
          controls_div.style.overflowY = "scroll";
          // tests select box
          controls_div.appendChild(document.createTextNode("Tests"));
          controls_div.appendChild(document.createElement("br"));
          const test_select = document.createElement("select");
          const test_options = [];
          for (let i = 0; i < g_testEntries.length; ++i) {
              const option = document.createElement("option");
              option.text = `${g_testEntries[i].category}:${g_testEntries[i].name}`;
              option.value = i.toString();
              test_options.push(option);
          }
          test_options.sort((a, b) => a.text.localeCompare(b.text));
          for (let i = 0; i < test_options.length; ++i) {
              const option = test_options[i];
              test_select.add(option);
          }
          test_select.selectedIndex = this.m_settings.m_testIndex = 0;
          test_select.addEventListener("change", (e) => {
              this.m_settings.m_testIndex = test_select.selectedIndex;
              this.LoadTest();
          });
          controls_div.appendChild(test_select);
          this.m_test_select = test_select;
          this.m_test_options = test_options;
          controls_div.appendChild(document.createElement("br"));
          controls_div.appendChild(document.createElement("hr"));
          // simulation number inputs
          function connect_number_input(parent, label, init, update, min, max, step) {
              const number_input_tr = parent.appendChild(document.createElement("tr"));
              const number_input_td0 = number_input_tr.appendChild(document.createElement("td"));
              number_input_td0.align = "right";
              number_input_td0.appendChild(document.createTextNode(label));
              const number_input_td1 = number_input_tr.appendChild(document.createElement("td"));
              const number_input = document.createElement("input");
              number_input.size = 8;
              number_input.min = min.toString();
              number_input.max = max.toString();
              number_input.step = step.toString();
              number_input.value = init.toString();
              number_input.addEventListener("change", (e) => {
                  update(parseInt(number_input.value, 10));
              });
              number_input_td1.appendChild(number_input);
              return number_input;
          }
          const number_input_table = controls_div.appendChild(document.createElement("table"));
          connect_number_input(number_input_table, "Vel Iters", this.m_settings.m_velocityIterations, (value) => { this.m_settings.m_velocityIterations = value; }, 1, 20, 1);
          connect_number_input(number_input_table, "Pos Iters", this.m_settings.m_positionIterations, (value) => { this.m_settings.m_positionIterations = value; }, 1, 20, 1);
          // #if B2_ENABLE_PARTICLE
          connect_number_input(number_input_table, "Pcl Iters", this.m_settings.m_particleIterations, (value) => { this.m_settings.m_particleIterations = value; }, 1, 100, 1);
          // #endif
          connect_number_input(number_input_table, "Hertz", this.m_settings.m_hertz, (value) => { this.m_settings.m_hertz = value; }, 10, 120, 1);
          // simulation checkbox inputs
          function connect_checkbox_input(parent, label, init, update) {
              const checkbox_input = document.createElement("input");
              checkbox_input.type = "checkbox";
              checkbox_input.checked = init;
              checkbox_input.addEventListener("click", (e) => {
                  update(checkbox_input.checked);
              });
              parent.appendChild(checkbox_input);
              parent.appendChild(document.createTextNode(label));
              parent.appendChild(document.createElement("br"));
              return checkbox_input;
          }
          connect_checkbox_input(controls_div, "Sleep", this.m_settings.m_enableSleep, (value) => { this.m_settings.m_enableSleep = value; });
          connect_checkbox_input(controls_div, "Warm Starting", this.m_settings.m_enableWarmStarting, (value) => { this.m_settings.m_enableWarmStarting = value; });
          connect_checkbox_input(controls_div, "Time of Impact", this.m_settings.m_enableContinuous, (value) => { this.m_settings.m_enableContinuous = value; });
          connect_checkbox_input(controls_div, "Sub-Stepping", this.m_settings.m_enableSubStepping, (value) => { this.m_settings.m_enableSubStepping = value; });
          // #if B2_ENABLE_PARTICLE
          connect_checkbox_input(controls_div, "Strict Particle/Body Contacts", this.m_settings.m_strictContacts, (value) => { this.m_settings.m_strictContacts = value; });
          // #endif
          // draw checkbox inputs
          const draw_fieldset = controls_div.appendChild(document.createElement("fieldset"));
          const draw_legend = draw_fieldset.appendChild(document.createElement("legend"));
          draw_legend.appendChild(document.createTextNode("Draw"));
          connect_checkbox_input(draw_fieldset, "Shapes", this.m_settings.m_drawShapes, (value) => { this.m_settings.m_drawShapes = value; });
          // #if B2_ENABLE_PARTICLE
          connect_checkbox_input(draw_fieldset, "Particles", this.m_settings.m_drawParticles, (value) => { this.m_settings.m_drawParticles = value; });
          // #endif
          connect_checkbox_input(draw_fieldset, "Joints", this.m_settings.m_drawJoints, (value) => { this.m_settings.m_drawJoints = value; });
          connect_checkbox_input(draw_fieldset, "AABBs", this.m_settings.m_drawAABBs, (value) => { this.m_settings.m_drawAABBs = value; });
          connect_checkbox_input(draw_fieldset, "Contact Points", this.m_settings.m_drawContactPoints, (value) => { this.m_settings.m_drawContactPoints = value; });
          connect_checkbox_input(draw_fieldset, "Contact Normals", this.m_settings.m_drawContactNormals, (value) => { this.m_settings.m_drawContactNormals = value; });
          connect_checkbox_input(draw_fieldset, "Contact Impulses", this.m_settings.m_drawContactImpulse, (value) => { this.m_settings.m_drawContactImpulse = value; });
          connect_checkbox_input(draw_fieldset, "Friction Impulses", this.m_settings.m_drawFrictionImpulse, (value) => { this.m_settings.m_drawFrictionImpulse = value; });
          connect_checkbox_input(draw_fieldset, "Center of Masses", this.m_settings.m_drawCOMs, (value) => { this.m_settings.m_drawCOMs = value; });
          connect_checkbox_input(draw_fieldset, "Statistics", this.m_settings.m_drawStats, (value) => { this.m_settings.m_drawStats = value; });
          connect_checkbox_input(draw_fieldset, "Profile", this.m_settings.m_drawProfile, (value) => { this.m_settings.m_drawProfile = value; });
          // simulation buttons
          function connect_button_input(parent, label, callback) {
              const button_input = document.createElement("input");
              button_input.type = "button";
              button_input.style.width = "120";
              button_input.value = label;
              button_input.addEventListener("click", callback);
              parent.appendChild(button_input);
              parent.appendChild(document.createElement("br"));
              return button_input;
          }
          const button_div = controls_div.appendChild(document.createElement("div"));
          button_div.align = "center";
          connect_button_input(button_div, "Pause (P)", (e) => { this.Pause(); });
          connect_button_input(button_div, "Single Step (O)", (e) => { this.SingleStep(); });
          connect_button_input(button_div, "Restart (R)", (e) => { this.LoadTest(); });
          this.m_demo_button = connect_button_input(button_div, "Demo", (e) => { this.ToggleDemo(); });
          // disable context menu to use right-click
          window.addEventListener("contextmenu", (e) => { e.preventDefault(); }, true);
          canvas_div.addEventListener("mousemove", (e) => { this.HandleMouseMove(e); });
          canvas_div.addEventListener("mousedown", (e) => { this.HandleMouseDown(e); });
          canvas_div.addEventListener("mouseup", (e) => { this.HandleMouseUp(e); });
          canvas_div.addEventListener("mousewheel", (e) => { this.HandleMouseWheel(e); });
          canvas_div.addEventListener("touchmove", (e) => { this.HandleTouchMove(e); });
          canvas_div.addEventListener("touchstart", (e) => { this.HandleTouchStart(e); });
          canvas_div.addEventListener("touchend", (e) => { this.HandleTouchEnd(e); });
          window.addEventListener("keydown", (e) => { this.HandleKeyDown(e); });
          window.addEventListener("keyup", (e) => { this.HandleKeyUp(e); });
          this.LoadTest();
          this.m_time_last = time;
      }
      HomeCamera() {
          g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
          g_camera.m_center.Set(0, 20 * g_camera.m_zoom);
          ///g_camera.m_roll.SetAngle(b2.DegToRad(0));
      }
      MoveCamera(move) {
          const position = g_camera.m_center.Clone();
          ///move.SelfRotate(g_camera.m_roll.GetAngle());
          position.SelfAdd(move);
          g_camera.m_center.Copy(position);
      }
      ///public RollCamera(roll: number): void {
      ///  const angle: number = g_camera.m_roll.GetAngle();
      ///  g_camera.m_roll.SetAngle(angle + roll);
      ///}
      ZoomCamera(zoom) {
          g_camera.m_zoom *= zoom;
          g_camera.m_zoom = b2__namespace.Clamp(g_camera.m_zoom, 0.02, 20);
      }
      HandleMouseMove(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          this.m_mouse.Copy(element);
          if (this.m_lMouseDown) {
              if (this.m_test) {
                  this.m_test.MouseMove(world);
              }
          }
          if (this.m_rMouseDown) {
              // m_center = viewCenter0 - (projection - projection0);
              const projection = g_camera.ConvertElementToProjection(element, new b2__namespace.Vec2());
              const diff = b2__namespace.Vec2.SubVV(projection, this.m_projection0, new b2__namespace.Vec2());
              const center = b2__namespace.Vec2.SubVV(this.m_viewCenter0, diff, new b2__namespace.Vec2());
              g_camera.m_center.Copy(center);
          }
      }
      HandleMouseDown(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          switch (e.which) {
              case 1: // left mouse button
                  this.m_lMouseDown = true;
                  if (this.m_shift) {
                      if (this.m_test) {
                          this.m_test.ShiftMouseDown(world);
                      }
                  }
                  else {
                      if (this.m_test) {
                          this.m_test.MouseDown(world);
                      }
                  }
                  break;
              case 3: // right mouse button
                  this.m_rMouseDown = true;
                  const projection = g_camera.ConvertElementToProjection(element, new b2__namespace.Vec2());
                  this.m_projection0.Copy(projection);
                  this.m_viewCenter0.Copy(g_camera.m_center);
                  break;
          }
      }
      HandleMouseUp(e) {
          const element = new b2__namespace.Vec2(e.clientX, e.clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          switch (e.which) {
              case 1: // left mouse button
                  this.m_lMouseDown = false;
                  if (this.m_test) {
                      this.m_test.MouseUp(world);
                  }
                  break;
              case 3: // right mouse button
                  this.m_rMouseDown = false;
                  break;
          }
      }
      HandleTouchMove(e) {
          const element = new b2__namespace.Vec2(e.touches[0].clientX, e.touches[0].clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          if (this.m_test) {
              this.m_test.MouseMove(world);
          }
          e.preventDefault();
      }
      HandleTouchStart(e) {
          const element = new b2__namespace.Vec2(e.touches[0].clientX, e.touches[0].clientY);
          const world = g_camera.ConvertScreenToWorld(element, new b2__namespace.Vec2());
          if (this.m_test) {
              this.m_test.MouseDown(world);
          }
          e.preventDefault();
      }
      HandleTouchEnd(e) {
          if (this.m_test) {
              this.m_test.MouseUp(this.m_test.m_mouseWorld);
          }
          e.preventDefault();
      }
      HandleMouseWheel(e) {
          if (e.deltaY > 0) {
              this.ZoomCamera(1 / 1.1);
          }
          else if (e.deltaY < 0) {
              this.ZoomCamera(1.1);
          }
          e.preventDefault();
      }
      HandleKeyDown(e) {
          switch (e.key) {
              case "Control":
                  this.m_ctrl = true;
                  break;
              case "Shift":
                  this.m_shift = true;
                  break;
              case "ArrowLeft":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(2, 0));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(-0.5, 0));
                  }
                  break;
              case "ArrowRight":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(-2, 0));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0.5, 0));
                  }
                  break;
              case "ArrowDown":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(0, 2));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0, -0.5));
                  }
                  break;
              case "ArrowUp":
                  if (this.m_ctrl) {
                      if (this.m_test) {
                          this.m_test.ShiftOrigin(new b2__namespace.Vec2(0, -2));
                      }
                  }
                  else {
                      this.MoveCamera(new b2__namespace.Vec2(0, 0.5));
                  }
                  break;
              case "Home":
                  this.HomeCamera();
                  break;
              ///case "PageUp":
              ///  this.RollCamera(b2.DegToRad(-1));
              ///  break;
              ///case "PageDown":
              ///  this.RollCamera(b2.DegToRad(1));
              ///  break;
              case "z":
                  this.ZoomCamera(1.1);
                  break;
              case "x":
                  this.ZoomCamera(0.9);
                  break;
              case "r":
                  this.LoadTest();
                  break;
              case " ":
                  if (this.m_test) {
                      this.m_test.LaunchBomb();
                  }
                  break;
              case "o":
                  this.SingleStep();
                  break;
              case "p":
                  this.Pause();
                  break;
              case "[":
                  this.DecrementTest();
                  break;
              case "]":
                  this.IncrementTest();
                  break;
              // #if B2_ENABLE_PARTICLE
              case ",":
                  if (this.m_shift) {
                      // Press < to select the previous particle parameter setting.
                      Test.particleParameter.Decrement();
                  }
                  break;
              case ".":
                  if (this.m_shift) {
                      // Press > to select the next particle parameter setting.
                      Test.particleParameter.Increment();
                  }
                  break;
          }
          if (this.m_test) {
              this.m_test.Keyboard(e.key);
          }
      }
      HandleKeyUp(e) {
          switch (e.key) {
              case "Control":
                  this.m_ctrl = false;
                  break;
              case "Shift":
                  this.m_shift = false;
                  break;
          }
          if (this.m_test) {
              this.m_test.KeyboardUp(e.key);
          }
      }
      UpdateTest(time_elapsed) {
          if (this.m_demo_mode) {
              this.m_demo_time += time_elapsed;
              if (this.m_demo_time > this.m_max_demo_time) {
                  this.IncrementTest();
              }
              const str = ((500 + this.m_max_demo_time - this.m_demo_time) / 1000).toFixed(0).toString();
              this.m_demo_button.value = str;
          }
          else {
              this.m_demo_button.value = "Demo";
          }
      }
      DecrementTest() {
          if (this.m_settings.m_testIndex <= 0) {
              this.m_settings.m_testIndex = this.m_test_options.length;
          }
          this.m_settings.m_testIndex--;
          this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
          this.LoadTest();
      }
      IncrementTest() {
          this.m_settings.m_testIndex++;
          if (this.m_settings.m_testIndex >= this.m_test_options.length) {
              this.m_settings.m_testIndex = 0;
          }
          this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
          this.LoadTest();
      }
      LoadTest(restartTest = false) {
          // #if B2_ENABLE_PARTICLE
          Test.fullscreenUI.Reset();
          if (!restartTest) {
              Test.particleParameter.Reset();
          }
          // #endif
          this.m_demo_time = 0;
          // #if B2_ENABLE_PARTICLE
          if (this.m_test) {
              this.m_test.RestoreParticleParameters();
          }
          // #endif
          this.m_test = g_testEntries[parseInt(this.m_test_options[this.m_settings.m_testIndex].value)].createFcn();
          if (!restartTest) {
              this.HomeCamera();
          }
      }
      Pause() {
          this.m_settings.m_pause = !this.m_settings.m_pause;
      }
      SingleStep() {
          this.m_settings.m_pause = true;
          this.m_settings.m_singleStep = true;
      }
      ToggleDemo() {
          this.m_demo_mode = !this.m_demo_mode;
      }
      SimulationLoop(time) {
          this.m_time_last = this.m_time_last || time;
          let time_elapsed = time - this.m_time_last;
          this.m_time_last = time;
          if (time_elapsed > 1000) {
              time_elapsed = 1000;
          } // clamp
          this.m_fps_time += time_elapsed;
          this.m_fps_frames++;
          if (this.m_fps_time >= 500) {
              this.m_fps = (this.m_fps_frames * 1000) / this.m_fps_time;
              this.m_fps_frames = 0;
              this.m_fps_time = 0;
              this.m_fps_div.innerHTML = this.m_fps.toFixed(1).toString();
          }
          if (time_elapsed > 0) {
              const ctx = this.m_ctx;
              // #if B2_ENABLE_PARTICLE
              const restartTest = [false];
              // #endif
              if (ctx) {
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  // ctx.strokeStyle = "blue";
                  // ctx.strokeRect(this.m_mouse.x - 24, this.m_mouse.y - 24, 48, 48);
                  // const mouse_world: b2.Vec2 = g_camera.ConvertScreenToWorld(this.m_mouse, new b2.Vec2());
                  ctx.save();
                  // 0,0 at center of canvas, x right, y up
                  ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                  ctx.scale(1, -1);
                  ///ctx.scale(g_camera.m_extent, g_camera.m_extent);
                  ///ctx.lineWidth /= g_camera.m_extent;
                  const s = 0.5 * g_camera.m_height / g_camera.m_extent;
                  ctx.scale(s, s);
                  ctx.lineWidth /= s;
                  // apply camera
                  ctx.scale(1 / g_camera.m_zoom, 1 / g_camera.m_zoom);
                  ctx.lineWidth *= g_camera.m_zoom;
                  ///ctx.rotate(-g_camera.m_roll.GetAngle());
                  ctx.translate(-g_camera.m_center.x, -g_camera.m_center.y);
                  if (this.m_test) {
                      this.m_test.Step(this.m_settings);
                  }
                  // #if B2_ENABLE_PARTICLE
                  // Update the state of the particle parameter.
                  Test.particleParameter.Changed(restartTest);
                  // #endif
                  // #if B2_ENABLE_PARTICLE
                  let msg = this.m_test_options[this.m_settings.m_testIndex].text;
                  if (Test.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                      msg += " : ";
                      msg += Test.particleParameter.GetName();
                  }
                  if (this.m_test) {
                      this.m_test.DrawTitle(msg);
                  }
                  // #else
                  // if (this.m_test) { this.m_test.DrawTitle(this.m_test_options[this.m_settings.m_testIndex].text); }
                  // #endif
                  // ctx.strokeStyle = "yellow";
                  // ctx.strokeRect(mouse_world.x - 0.5, mouse_world.y - 0.5, 1.0, 1.0);
                  ctx.restore();
              }
              // #if B2_ENABLE_PARTICLE
              if (restartTest[0]) {
                  this.LoadTest(true);
              }
              // #endif
              this.UpdateTest(time_elapsed);
          }
      }
  }

  exports.Camera = Camera;
  exports.ContactPoint = ContactPoint;
  exports.DRAW_STRING_NEW_LINE = DRAW_STRING_NEW_LINE;
  exports.DebugDraw = DebugDraw;
  exports.DestructionListener = DestructionListener;
  exports.EmittedParticleCallback = EmittedParticleCallback;
  exports.FullScreenUI = FullScreenUI;
  exports.Main = Main;
  exports.ParticleParameter = ParticleParameter;
  exports.ParticleParameterDefinition = ParticleParameterDefinition;
  exports.ParticleParameterValue = ParticleParameterValue;
  exports.RadialEmitter = RadialEmitter;
  exports.RandomFloat = RandomFloat;
  exports.RegisterTest = RegisterTest;
  exports.Settings = Settings;
  exports.Test = Test;
  exports.TestEntry = TestEntry;
  exports.g_camera = g_camera;
  exports.g_debugDraw = g_debugDraw;
  exports.g_testEntries = g_testEntries;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=testbed.umd.js.map
