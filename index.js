// run with `npm start`

const createTexture = require("gl-texture2d");
const createShader = require("gl-shader");

const w = 400;
const h = 240;

const container = document.createElement("div");
container.style.backgroundColor = "#eee";
document.body.appendChild(container);

const canvas = document.createElement("canvas");
canvas.width = w;
canvas.height = h;
container.appendChild(canvas);

const vertShader = `attribute vec2 _p;
varying vec2 uv;
void main() {
  gl_Position = vec4(_p,0.0,1.0);
  uv = vec2(0.5, 0.5) * (_p+vec2(1.0, 1.0));
}`;
const fragShader = `precision highp float;
varying vec2 uv;
uniform sampler2D texture;

void main() {
  gl_FragColor = vec4(
    vec3(
      texture2D(texture, uv).r,
      texture2D(texture, uv).g,
      texture2D(texture, uv).b
    ),
    1.0);
}`;
const opts = {};
const gl = (
  canvas.getContext("webgl", opts) ||
  canvas.getContext("webgl-experimental", opts) ||
  canvas.getContext("experimental-webgl", opts)
);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1.0, -1.0,
  1.0, -1.0,
  -1.0,  1.0,
  -1.0,  1.0,
  1.0, -1.0,
  1.0,  1.0
]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const shader = createShader(gl, vertShader, fragShader);
shader.bind();
shader.attributes._p.pointer();

const texture = createTexture(gl, [ w, h ]);
texture.minFilter = texture.magFilter = gl.LINEAR;

const c2 = document.createElement("canvas");
container.appendChild(c2);
c2.width = w;
c2.height = h;
const c = c2.getContext("2d");
c.clearRect(0, 0, w, h);
c.fillStyle = "#087";
c.fillRect(30, 30, 40, 30);

texture.setPixels(c2);

texture.bind();
gl.drawArrays(gl.TRIANGLES, 0, 6);

console.log("done");
