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

import { Test } from "./test.js";
import { g_debugDraw, g_camera } from "./draw.js";
import * as GCBox2D from '@box2d'

export class Main {
  public m_time_last: number = 0;
  public m_test?: Test;
  public m_shift: boolean = false;
  public m_demo_time: number = 0;
  public m_canvas_div: HTMLDivElement;
  public m_canvas_2d: HTMLCanvasElement;
  public m_ctx: CanvasRenderingContext2D | null = null

  constructor(time: number) {
    document.body.style.backgroundColor = "rgba(51, 51, 51, 1.0)";

    const main_div: HTMLDivElement = document.body.appendChild(document.createElement("div"));
    main_div.style.position = "absolute";
    main_div.style.left = "0px";
    main_div.style.top = "0px";

    function resize_main_div(): void {
      main_div.style.width = window.innerWidth + "px";
      main_div.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", (e: UIEvent): void => { resize_main_div(); });
    window.addEventListener("orientationchange", (e: Event): void => { resize_main_div(); });
    resize_main_div();

    const view_div: HTMLDivElement = main_div.appendChild(document.createElement("div"));

    const canvas_div: HTMLDivElement = this.m_canvas_div = view_div.appendChild(document.createElement("div"));
    canvas_div.style.position = "absolute"; // relative to view_div
    canvas_div.style.left = "0px";
    canvas_div.style.right = "0px";
    canvas_div.style.top = "0px";
    canvas_div.style.bottom = "0px";

    canvas_div.addEventListener('click', (event) => {
      const bodyDef = new GCBox2D.BodyDef()
      bodyDef.linearDamping = 1
      bodyDef.angularDamping = 1
      bodyDef.type = GCBox2D.BodyType.b2_dynamicBody
      bodyDef.position.Set(event.x, event.y)

      let shape = new GCBox2D.PolygonShape()
      shape = shape.SetAsBox(10, 10)

      const def = new GCBox2D.FixtureDef()
      def.density = 1
      def.friction = 0.3
      def.restitution = 0
      def.shape = shape

      console.log(event.x, event.y)

      const body = this.m_test?.m_world.CreateBody(bodyDef)
      if (body) {
        body.CreateFixture(def)
      }
    })

    const canvas_2d: HTMLCanvasElement = this.m_canvas_2d = canvas_div.appendChild(document.createElement("canvas"));

    function resize_canvas(): void {
      ///console.log(canvas_div.clientWidth + "x" + canvas_div.clientHeight);
      if (canvas_2d.width !== canvas_div.clientWidth) {
        g_camera.m_width = canvas_2d.width = canvas_div.clientWidth;
      }
      if (canvas_2d.height !== canvas_div.clientHeight) {
        g_camera.m_height = canvas_2d.height = canvas_div.clientHeight;
      }
    }
    window.addEventListener("resize", (e: UIEvent): void => { resize_canvas(); });
    window.addEventListener("orientationchange", (e: Event): void => { resize_canvas(); });
    resize_canvas();

    g_debugDraw.m_ctx = this.m_ctx = this.m_canvas_2d.getContext("2d");

    // simulation number inputs
    // draw checkbox inputs
    // simulation buttons
    // disable context menu to use right-click
    window.addEventListener("contextmenu", (e: MouseEvent): void => { e.preventDefault(); }, true);

    this.m_test = new Test();
    this.HomeCamera();

    this.m_time_last = time;
  }

  public HomeCamera(): void {
    g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
    g_camera.m_center.Set(0, 0);
  }

  public SimulationLoop(time: number): void {
    this.m_time_last = this.m_time_last || time;
    let time_elapsed: number = time - this.m_time_last;
    this.m_time_last = time;
    if (time_elapsed > 1000) { time_elapsed = 1000; }
    if (time_elapsed > 0) {
      const ctx: CanvasRenderingContext2D | null = this.m_ctx;
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);;
        const s: number = 0.5 * g_camera.m_height / g_camera.m_extent;
        ctx.scale(s, s);
        ctx.lineWidth /= s;
        ctx.scale(1, 1);
        ctx.translate(-g_camera.m_center.x, -g_camera.m_center.y);
        if (this.m_test) {
          this.m_test.Step();
        }
        ctx.restore();
      }
    }
  }
}
