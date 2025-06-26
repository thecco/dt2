import * as THREE from 'three';

export function GlowMaterial({ glowColor = new THREE.Color(0x00ffff), c = 1.0, p = 2.7 }) {
	return new THREE.ShaderMaterial({
		uniforms: {
			glowColor: { value: glowColor },
			c: { value: c },
			p: { value: p }
		},
		vertexShader: `
      		uniform float c;
      		uniform float p;
      		varying float intensity;

      		void main() {
      			vec3 vNormal = normalize(normalMatrix * normal);
      			float dotView = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      			float clamped = clamp(c - dotView, 0.0, 1.0);
      			intensity = pow(clamped, p);
      			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      		}
		`,
		fragmentShader: `
			uniform vec3 glowColor;
			varying float intensity;

			void main() {
				gl_FragColor = vec4(glowColor, intensity);
			}
   		`,
		side: THREE.FrontSide,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
				polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -4
	});
}
