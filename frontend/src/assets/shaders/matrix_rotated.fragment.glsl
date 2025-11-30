precision mediump float;

uniform float iTime;
uniform vec3 iResolution;
uniform sampler2D iChannel0;

varying vec2 vUv;

void main() {
    // vec4 tex = texture2D(iChannel0, vUv);
    // gl_FragColor = vec4(tex.rgb, 1.0); // ВАЖНО: alpha = 1.0
    float M = 0.0;
    float A = 0.0;
    float T = iTime;
    float R = 0.0;
    vec4 I = vec4(0.0);
    vec4 X;
    vec4 p;

    // как на Shadertoy: u в пикселях
    vec2 u = vUv * iResolution.xy;

    for(R = 0.0; R < 66.0; R += 1.0) {
        X = iResolution.xyzz;

        // ровно как в примере, только с .0 и texture2D
        p = A * normalize(vec4((u + u - X.xy) *
            mat2(cos(A * sin(T * 0.1) * 0.3 + vec4(0.0, 33.0, 11.0, 0.0))), X.y, 0.0));

        p.z += T;
        p.y = abs(abs(p.y) - 1.0);

        X = fract(dot(X = ceil(p * 4.0), sin(X)) + X);
        X.g += 4.0;

        // vec2 change to 4.0 for glyph_atlas vec2(16, 6)
        float texA = texture2D(iChannel0, (p.xz + ceil(T + X.x)) / 4.0).a;

        M = 4.0 * pow(smoothstep(1.0, 0.5, texA), 8.0) - 5.0;

        A += p.y * 0.6 - (M + A + A + 3.0) / 67.0;

        I += (X.a + .5) * (X + A) * (1.4 - p.y) / 2e2 / M / M / exp(A * .1);
        vec3 col = I.rgb / 1.2;
        gl_FragColor = vec4(col, 1.0);
    }
}
