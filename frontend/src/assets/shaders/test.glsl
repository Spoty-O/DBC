precision mediump float;

uniform float iTime;
uniform vec3 iResolution;

varying vec2 vUv;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 f) {
  return a + b * cos(6.283185 * (c * t + f));
}

float sdEquilateralTriangle(in vec2 p, in float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if(p.x + k * p.y > 0.0)
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}

void main() {
  vec2 uv = vUv * 2. - 1.;
  uv.x *= iResolution.x / iResolution.y;

  vec3 a = vec3(0.699, 0.410, 0.574);
  vec3 b = vec3(0.149, 0.491, 0.500);
  vec3 c = vec3(0.128, 0.920, 1.370);
  vec3 f = vec3(0.429, 0.535, 4.233);

  float d = length(uv);

  vec3 col = palette(d + iTime * 0.3, a, b, c, f);

  d = sdEquilateralTriangle(uv, .5);

  d = sin(d * 8. + iTime) / 8.;

  // d = sin(d * 8. + iTime) / 8.;
  d = abs(d);

  d = 0.02 / d;

  col *= d;

  gl_FragColor = vec4(col, 1.);
}