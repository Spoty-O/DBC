precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform float uCellSize;
uniform float uLayerStrength;
uniform float uSpeedMul;
uniform float uSeedOffset;

varying vec2 vUv;

const vec2 ATLAS_SIZE = vec2(9.0);
const vec3 COLOR_TAIL = vec3(0.1, 0.85, 0.25);
const vec3 COLOR_HEAD = vec3(0.78, 1.0, 0.84);

uint murmurHash11(uint x) {
  x *= 0x5bd1e995u;
  x ^= x >> 24u;
  x *= 0x5bd1e995u;
  return x;
}

float hash(float v) {
  uint h = murmurHash11(floatBitsToUint(v));
  return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

float rand(float min, float max, float seed) {
  return mix(min, max, hash(seed));
}

float median3(vec3 v) {
  return max(min(v.r, v.g), min(max(v.r, v.g), v.b));
}

vec2 getCellUV(vec2 px) {
  return fract(px / uCellSize);
}

float getGlyphId(vec2 cell) {
  float seed = cell.x * 157.0 + cell.y * 113.0;
  float rate = 0.2;
  float phase = rand(1.0, 100.0, seed + 2.0);
  float tick = floor(iTime * rate + phase);
  return floor(rand(0.0, 81.0, seed + tick * 271.0));
}

vec2 getAtlasUV(vec2 localUV, float glyphId) {
  vec2 index = vec2(mod(glyphId, ATLAS_SIZE.x), floor(glyphId / ATLAS_SIZE.y));
  return (index + localUV) / ATLAS_SIZE;
}

float sampleGlyph(vec2 px, vec2 cell) {
  vec2 uv = getCellUV(px);
  float padding = 0.08;
  uv = uv * (1.0 - 2.0 * padding) + padding;
  float id = getGlyphId(cell);
  vec2 atlasUV = getAtlasUV(uv, id);
  vec3 msdf = texture2D(iChannel0, atlasUV).rgb;
  float sd = median3(msdf) - 0.5;
  float w = fwidth(sd);
  float bias = 0.06;
  return smoothstep(-w - bias, w - bias, sd);
}

float columnSpeed(float col) {
  return rand(1.0, 5.0, col);
}

float columnTail(float col, float rows) {
  return rand(rows * 0.6, rows * 0.8, col * 137.0);
}

float columnPhase(float col, float tail) {
  return rand(15.0, 200.0, col - tail);
}

float headDistance(float row, float col, float rows, float speed, float phase) {
  float head = iTime * speed + phase;
  float wrapped = mod(head, rows);
  return mod(wrapped + row, rows);
}

float tailBrightness(float d, float tail, float colSeed) {
  float t = clamp(1.0 - d / tail, 0.0, 1.0);
  t = pow(t, 1.8);
  float colGain = rand(0.55, 1.25, colSeed + 91.0);
  return t * colGain * uLayerStrength;
}

float headMask(float d) {
  return smoothstep(3.0, 0.0, d);
}

vec3 getColor(float d) {
  float h = headMask(d);
  vec3 tail = COLOR_TAIL * 0.95;
  vec3 head = COLOR_HEAD * 1.5;
  return mix(tail, head, h);
}

void main() {
  vec2 px = vUv * iResolution.xy;
  vec2 cell = floor(px / uCellSize);
  float row = cell.y;
  float col = cell.x;
  float colSeed = col + uSeedOffset * 13.0;
  float rows = floor(iResolution.y / uCellSize);
  float speed = columnSpeed(col + uSeedOffset) * uSpeedMul;
  float tail = columnTail(col, rows);
  float phase = columnPhase(col, tail);
  float d = headDistance(row, col, rows, speed, phase);
  float b = tailBrightness(d, tail, colSeed);
  if(b < 0.004) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float glyph = sampleGlyph(px, cell);
  float alpha = b * glyph;
  vec3 color = getColor(d) * alpha;
  gl_FragColor = vec4(color, alpha);
}
