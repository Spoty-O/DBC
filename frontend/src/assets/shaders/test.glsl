precision mediump float;

uniform float iTime;
uniform vec3 iResolution;
uniform sampler2D iChannel0;

varying vec2 vUv;

const float GRID_X = 32.0;
const float GRID_Y = 12.0;
const float GLYPH_COUNT = GRID_X * GRID_Y; // 384

float sampleGlyph(vec2 localUV, float index) {
  index = mod(index, GLYPH_COUNT);

  float x = mod(index, GRID_X);
  float y = floor(index / GRID_X);

  vec2 uv = (localUV + vec2(x, y)) / vec2(GRID_X, GRID_Y);
  return texture(iChannel0, uv).r;
}

void main() {
  // vec2 uv = (vUv * iResolution.xy - 0.5 * iResolution.xy) / iResolution.y;
  // vec2 uv = vUv;
  // vec2 cell = floor(uv * vec2(GRID_X, GRID_Y));
  // vec2 local = fract(uv * vec2(GRID_X, GRID_Y));

  // float id = cell.x + cell.y * GRID_X;
  // float g = sampleGlyph(local, id);

  // gl_FragColor = vec4(vec3(g), 1.0);
  vec4 tex = texture2D(iChannel0, vUv);

    // используем альфу как маску, фон становится чёрным
  vec3 color = vec3(0.0); // чёрный фон
  color += tex.a;          // символы проявляются через альфу
  gl_FragColor = vec4(color, 1.0);

}