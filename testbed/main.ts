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
import { Settings } from "./settings.js";
import { Test, g_testEntries } from "./test.js";
import { g_debugDraw, g_camera } from "./draw.js";

export class Main {
  public m_time_last: number = 0;
  public m_fps_time: number = 0;
  public m_fps_frames: number = 0;
  public m_fps: number = 0;
  public m_fps_div: HTMLDivElement;
  public m_debug_div: HTMLDivElement;
  public readonly m_settings: Settings = new Settings();
  public m_test?: Test;
  public m_test_select: HTMLSelectElement;
  public m_test_options: HTMLOptionElement[];
  public m_shift: boolean = false;
  public m_ctrl: boolean = false;
  public m_lMouseDown: boolean = false;
  public m_rMouseDown: boolean = false;
  public readonly m_projection0: b2.Vec2 = new b2.Vec2();
  public readonly m_viewCenter0: b2.Vec2 = new b2.Vec2();
  public m_demo_mode: boolean = false;
  public m_demo_time: number = 0;
  public m_max_demo_time: number = 1000 * 10;
  public m_canvas_div: HTMLDivElement;
  public m_canvas_2d: HTMLCanvasElement;
  public m_ctx: CanvasRenderingContext2D | null = null

  constructor(time: number) {
    const fps_div: HTMLDivElement = this.m_fps_div = document.body.appendChild(document.createElement("div"));
    fps_div.style.position = "absolute";
    fps_div.style.left = "0px";
    fps_div.style.bottom = "0px";
    fps_div.style.backgroundColor = "rgba(0,0,255,0.75)";
    fps_div.style.color = "white";
    fps_div.style.font = "10pt Courier New";
    fps_div.style.zIndex = "256";
    fps_div.innerHTML = "FPS";

    const debug_div: HTMLDivElement = this.m_debug_div = document.body.appendChild(document.createElement("div"));
    debug_div.style.position = "absolute";
    debug_div.style.left = "0px";
    debug_div.style.bottom = "0px";
    debug_div.style.backgroundColor = "rgba(0,0,255,0.75)";
    debug_div.style.color = "white";
    debug_div.style.font = "10pt Courier New";
    debug_div.style.zIndex = "256";
    debug_div.innerHTML = "";

    document.body.style.backgroundColor = "rgba(51, 51, 51, 1.0)";

    const main_div: HTMLDivElement = document.body.appendChild(document.createElement("div"));
    main_div.style.position = "absolute"; // relative to document.body
    main_div.style.left = "0px";
    main_div.style.top = "0px";

    function resize_main_div(): void {
      // console.log(window.innerWidth + "x" + window.innerHeight);
      main_div.style.width = window.innerWidth + "px";
      main_div.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", (e: UIEvent): void => { resize_main_div(); });
    window.addEventListener("orientationchange", (e: Event): void => { resize_main_div(); });
    resize_main_div();

    const title_div: HTMLDivElement = main_div.appendChild(document.createElement("div"));
    title_div.style.textAlign = "center";
    title_div.style.color = "grey";
    title_div.innerHTML = "Box2D Testbed version " + b2.version.toString();

    const view_div: HTMLDivElement = main_div.appendChild(document.createElement("div"));

    const canvas_div: HTMLDivElement = this.m_canvas_div = view_div.appendChild(document.createElement("div"));
    canvas_div.style.position = "absolute"; // relative to view_div
    canvas_div.style.left = "0px";
    canvas_div.style.right = "0px";
    canvas_div.style.top = "0px";
    canvas_div.style.bottom = "0px";

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

    // tests select box
    const test_select: HTMLSelectElement = document.createElement("select");
    const test_options: HTMLOptionElement[] = [];
    for (let i: number = 0; i < g_testEntries.length; ++i) {
      const option: HTMLOptionElement = document.createElement("option");
      option.text = `${g_testEntries[i].category}:${g_testEntries[i].name}`;
      option.value = i.toString();
      test_options.push(option);
    }
    test_options.sort((a: HTMLOptionElement, b: HTMLOptionElement) => a.text.localeCompare(b.text));
    for (let i: number = 0; i < test_options.length; ++i) {
      const option: HTMLOptionElement = test_options[i];
      test_select.add(option);
    }
    test_select.selectedIndex = this.m_settings.m_testIndex = 0;
    test_select.addEventListener("change", (e: Event): void => {
      this.m_settings.m_testIndex = test_select.selectedIndex;
      this.LoadTest();
    });
    this.m_test_select = test_select;
    this.m_test_options = test_options;
    // simulation number inputs
    // draw checkbox inputs
    // simulation buttons
    // disable context menu to use right-click
    window.addEventListener("contextmenu", (e: MouseEvent): void => { e.preventDefault(); }, true);

    this.LoadTest();

    this.m_time_last = time;
  }

  public HomeCamera(): void {
    g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
    g_camera.m_center.Set(0, 20 * g_camera.m_zoom);
    ///g_camera.m_roll.SetAngle(b2.DegToRad(0));
  }

  private m_mouse = new b2.Vec2();

  public HandleMouseMove(e: MouseEvent): void {
    const element: b2.Vec2 = new b2.Vec2(e.clientX, e.clientY);
    const world: b2.Vec2 = g_camera.ConvertScreenToWorld(element, new b2.Vec2());

    this.m_mouse.Copy(element);

    if (this.m_lMouseDown) {
      if (this.m_test) { this.m_test.MouseMove(world); }
    }

    if (this.m_rMouseDown) {
      // m_center = viewCenter0 - (projection - projection0);
      const projection: b2.Vec2 = g_camera.ConvertElementToProjection(element, new b2.Vec2());
      const diff: b2.Vec2 = b2.Vec2.SubVV(projection, this.m_projection0, new b2.Vec2());
      const center: b2.Vec2 = b2.Vec2.SubVV(this.m_viewCenter0, diff, new b2.Vec2());
      g_camera.m_center.Copy(center);
    }
  }

  public HandleTouchStart(e: TouchEvent): void {
    const element: b2.Vec2 = new b2.Vec2(e.touches[0].clientX, e.touches[0].clientY);
    const world: b2.Vec2 = g_camera.ConvertScreenToWorld(element, new b2.Vec2());
    if (this.m_test) { this.m_test.MouseDown(world); }
    e.preventDefault();
  }

  public HandleTouchEnd(e: TouchEvent): void {
    if (this.m_test) { this.m_test.MouseUp(this.m_test.m_mouseWorld); }
    e.preventDefault();
  }

  public UpdateTest(time_elapsed: number): void {
    if (this.m_demo_mode) {
      this.m_demo_time += time_elapsed;

      if (this.m_demo_time > this.m_max_demo_time) {
        this.IncrementTest();
      }

      // const str: string = ((500 + this.m_max_demo_time - this.m_demo_time) / 1000).toFixed(0).toString();
      // this.m_demo_button.value = str;
    } else {
      // this.m_demo_button.value = "Demo";
    }
  }

  public DecrementTest(): void {
    if (this.m_settings.m_testIndex <= 0) {
      this.m_settings.m_testIndex = this.m_test_options.length;
    }
    this.m_settings.m_testIndex--;
    this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
    this.LoadTest();
  }

  public IncrementTest(): void {
    this.m_settings.m_testIndex++;
    if (this.m_settings.m_testIndex >= this.m_test_options.length) {
      this.m_settings.m_testIndex = 0;
    }
    this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
    this.LoadTest();
  }

  public LoadTest(restartTest: boolean = false): void {
    // #if B2_ENABLE_PARTICLE
    Test.fullscreenUI.Reset();
    if (!restartTest) { Test.particleParameter.Reset(); }
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

  public Pause(): void {
    this.m_settings.m_pause = !this.m_settings.m_pause;
  }

  public SingleStep(): void {
    this.m_settings.m_pause = true;
    this.m_settings.m_singleStep = true;
  }

  public ToggleDemo(): void {
    this.m_demo_mode = !this.m_demo_mode;
  }

  public SimulationLoop(time: number): void {
    this.m_time_last = this.m_time_last || time;

    let time_elapsed: number = time - this.m_time_last;
    this.m_time_last = time;

    if (time_elapsed > 1000) { time_elapsed = 1000; } // clamp

    this.m_fps_time += time_elapsed;
    this.m_fps_frames++;

    if (this.m_fps_time >= 500) {
      this.m_fps = (this.m_fps_frames * 1000) / this.m_fps_time;
      this.m_fps_frames = 0;
      this.m_fps_time = 0;

      this.m_fps_div.innerHTML = this.m_fps.toFixed(1).toString();
    }

    if (time_elapsed > 0) {
      const ctx: CanvasRenderingContext2D | null = this.m_ctx;

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
        const s: number = 0.5 * g_camera.m_height / g_camera.m_extent;
        ctx.scale(s, s);
        ctx.lineWidth /= s;

          // apply camera
        ctx.scale(1 / g_camera.m_zoom, 1 / g_camera.m_zoom);
        ctx.lineWidth *= g_camera.m_zoom;
          ///ctx.rotate(-g_camera.m_roll.GetAngle());
        ctx.translate(-g_camera.m_center.x, -g_camera.m_center.y);

        if (this.m_test) { this.m_test.Step(this.m_settings); }

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
        if (this.m_test) { this.m_test.DrawTitle(msg); }
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

import "./tests/box_stack.js"
