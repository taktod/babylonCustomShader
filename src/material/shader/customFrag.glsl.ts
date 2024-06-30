import { ShaderStore } from "@babylonjs/core";

ShaderStore.ShadersStore["customFragmentShader"] = `
void main(void) {
  gl_FragColor= vec4(1.0);
}
`;