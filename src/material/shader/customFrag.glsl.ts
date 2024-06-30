import { ShaderStore } from "@babylonjs/core";

import "./shaderInclude/customFragmentDeclaration.glsl";
import "./shaderInclude/customUboDeclaration.glsl";

ShaderStore.ShadersStore["customFragmentShader"] = `
#include<__decl__customFragment>

void main(void) {
  gl_FragColor= vec4(vec3(test), 1.0);
}
`;