export const LINE_VERTEX = /* glsl */ `
attribute float aT;
attribute float aSeed;
attribute float aSpeed;
attribute float aMix;
attribute float aBase;

varying float vT;
varying float vSeed;
varying float vSpeed;
varying float vMix;
varying float vBase;
varying float vDepth;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vT = aT;
  vSeed = aSeed;
  vSpeed = aSpeed;
  vMix = aMix;
  vBase = aBase;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`

// Cada linha carrega um pulso que percorre seu comprimento (aT de 0 a 1) com cauda.
export const LINE_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uPresence;
uniform float uFog;
uniform float uGain;
uniform vec3 uCyan;
uniform vec3 uOrange;

varying float vT;
varying float vSeed;
varying float vSpeed;
varying float vMix;
varying float vBase;
varying float vDepth;

void main() {
  float head = fract(vSeed + uTime * vSpeed);
  float behind = fract(head - vT);
  float trail = exp(-behind * 9.0);
  float fade = exp(-pow(uFog * vDepth, 2.0) * 0.55);
  float alpha = (vBase + trail * uGain) * fade * uPresence;
  vec3 color = mix(uCyan, uOrange, vMix) * (0.75 + trail * 0.9);
  gl_FragColor = vec4(color, alpha);
}
`

export const POINT_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;

uniform float uScale;
uniform float uTime;
uniform float uPulse;

varying vec3 vColor;
varying float vPulse;
varying float vDepth;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float wave = sin(uTime * 1.6 + aPhase * 6.2831853);
  vDepth = -mv.z;
  vColor = aColor;
  vPulse = mix(1.0, 0.72 + 0.28 * wave, uPulse);
  gl_PointSize = clamp(aSize * (1.0 + uPulse * 0.18 * wave) * uScale / max(vDepth, 0.1), 1.0, 120.0);
  gl_Position = projectionMatrix * mv;
}
`

export const POINT_FRAGMENT = /* glsl */ `
uniform float uPresence;
uniform float uFog;
uniform float uFogMix;
uniform float uIntensity;

varying vec3 vColor;
varying float vPulse;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;

  float halo = pow(1.0 - d, 2.4);
  float core = smoothstep(0.28, 0.0, d);
  float fog = exp(-pow(uFog * vDepth, 2.0));
  float fade = mix(1.0, fog, uFogMix);
  float alpha = (halo * 0.7 + core) * uIntensity * uPresence * fade * vPulse;
  gl_FragColor = vec4(vColor, alpha);
}
`
