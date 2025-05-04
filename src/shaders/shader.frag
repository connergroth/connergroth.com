precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iAngle;
uniform float iPower;
uniform float iOpacity;

varying vec2 vTexCoord;

// Function to convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Convert RGB to HSV
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main() {
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  
  // Adjust aspect ratio
  uv.x *= iResolution.x / iResolution.y;
  
  // Calculate the polar coordinates
  float r = length(uv);
  float theta = atan(uv.y, uv.x);
  
  // Add the rotation based on time
  theta += iAngle;
  
  // Convert back to cartesian coordinates
  uv.x = r * cos(theta);
  uv.y = r * sin(theta);
  
  // Calculate the shape
  float shape = 1.0 - smoothstep(0.0, 0.15, pow(abs(r - 0.5), iPower) / iPower);
  
  // The hex color #60a5fa converted to RGB (96/255, 165/255, 250/255)
  vec3 blueRgb = vec3(0.376, 0.647, 0.98);
  
  // Get a slightly varying version of the blue color for animation
  float t = iTime * 0.05;
  
  // Subtle animation effect around the base blue color
  vec3 color = blueRgb * (1.0 + 0.1 * sin(t + uv.x * 0.3 + uv.y * 0.3));
  
  // Apply color to shape with controllable opacity
  gl_FragColor = vec4(color * shape, shape * iOpacity);
} 