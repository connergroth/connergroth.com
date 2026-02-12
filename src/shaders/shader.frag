precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iAngle;
uniform float iPower;
uniform float iOpacity;

varying vec2 vTexCoord;

// Smooth noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractional Brownian Motion for richer noise
float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    val += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return val;
}

void main() {
  // Screen-space UV: -1 to 1 on both axes (circle = circle on screen)
  vec2 uv = vTexCoord * 2.0 - 1.0;

  // Aspect-corrected UV for detail effects only
  float aspect = iResolution.x / iResolution.y;
  vec2 uvDetail = uv;
  uvDetail.x *= aspect;

  float t = iTime * 0.15;

  // Subtle center drift in screen space
  vec2 center = vec2(-0.12 + 0.03 * sin(t * 0.7), 0.02 * cos(t * 0.9));
  vec2 p = uv - center;

  // Distance in screen space — blob fills screen as a circle
  float r = length(p);
  float theta = atan(p.y, p.x);

  // Organic edge distortion — multiple frequencies
  float warp = 0.0;
  warp += 0.12 * sin(theta * 2.0 + t * 2.5);
  warp += 0.09 * sin(theta * 3.0 - t * 1.8 + 1.0);
  warp += 0.06 * sin(theta * 5.0 + t * 3.2 + 2.5);
  warp += 0.04 * sin(theta * 7.0 - t * 2.0);
  warp += 0.07 * fbm(vec2(theta * 1.5, t * 1.2));

  float distortedR = r - warp;

  // Base shape
  float baseRadius = 0.72;
  float shape = 1.0 - smoothstep(baseRadius - 0.05, baseRadius + 0.18, distortedR);

  // Secondary bulge in screen space
  vec2 center2 = vec2(0.10 * cos(t * 1.3), 0.08 * sin(t * 1.1));
  vec2 p2 = p - center2;
  float r2 = length(p2);
  float theta2 = atan(p2.y, p2.x);
  float warp2 = 0.08 * sin(theta2 * 3.0 + t * 2.0) + 0.05 * sin(theta2 * 5.0 - t * 1.5);
  float shape2 = 1.0 - smoothstep(0.3, 0.5, r2 - warp2);

  // Merge shapes
  shape = max(shape, shape2 * 0.7);

  // Safe zone — guaranteed dark area covering the text, wide fade to blend with organic shape
  float safeRadius = 0.40;
  float safeShape = 1.0 - smoothstep(safeRadius, safeRadius + 0.30, r);
  shape = max(shape, safeShape);

  shape = clamp(shape, 0.0, 1.0);

  // Fade to 0 near canvas edges to prevent hard cutoff lines
  float edgeFade = smoothstep(0.0, 0.08, vTexCoord.x) * smoothstep(0.0, 0.08, 1.0 - vTexCoord.x)
                 * smoothstep(0.0, 0.08, vTexCoord.y) * smoothstep(0.0, 0.08, 1.0 - vTexCoord.y);
  shape *= edgeFade;

  // Internal gradation — use aspect-corrected coords for detail richness
  vec2 dp = uvDetail - center * vec2(aspect, 1.0);
  float brightness = 0.04;
  brightness += 0.05 * sin(dp.x * 3.0 + dp.y * 2.0 + t * 2.0);
  brightness += 0.04 * sin(dp.x * 1.5 - dp.y * 4.0 + t * 1.5);
  brightness += 0.03 * fbm(dp * 2.5 + t);

  vec3 color = vec3(brightness);

  gl_FragColor = vec4(color * shape, shape * iOpacity);
}
