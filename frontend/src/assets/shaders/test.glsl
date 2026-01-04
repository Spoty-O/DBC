precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;

varying vec2 vUv;

uniform float uCellSize;

uint murmurHash11(uint src) {
  const uint M = 0x5bd1e995u;
  uint h = 1190494759u;
  src *= M;
  src ^= src >> 24u;
  src *= M;
  h *= M;
  h ^= src;
  h ^= h >> 13u;
  h *= M;
  h ^= h >> 15u;
  return h;
}

// 1 output, 1 input
float hash(float src) {
  uint h = murmurHash11(floatBitsToUint(src));
  return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

float random(float min, float max, float col) {
  float r = hash(col);
  return min + r * (max - min);
}

void main() {
  vec2 pos = vUv.xy * iResolution.xy;
  float colIndex = floor(pos.x / uCellSize);
  float rowIndex = floor(pos.y / uCellSize);
  // float innerX = mod(pos.x, uCellSize);
  // float innerY = mod(pos.y, uCellSize);

  float speed = random(6., 15., colIndex);
  float tailLen = random(4., 15., colIndex);
  float phase = random(0., 5., colIndex);

  float head = iTime * speed - phase;
  float rowsCount = floor(iResolution.y/uCellSize);
  float headWrapped = mod(head, rowsCount);
  float d = mod(headWrapped + rowIndex, rowsCount);
  float brightness = 1. - d / tailLen;

  vec3 color = vec3(0.);
  color.g = brightness;
  gl_FragColor = vec4(color, 1.);
}
