import { AbstractMesh, Effect, ICustomShaderNameResolveOptions, MaterialDefines, Scene, StandardMaterial, StandardMaterialDefines, SubMesh, Texture } from "@babylonjs/core"

import "./shader/customVert.glsl";
import "./shader/customFrag.glsl";

export class CustomMaterial extends StandardMaterial {
  private _customAttributes: string[];
  private _customSamplers:{[name:string]:{type:string, val:Texture|null}};
  private _customUniforms:{[name:string]:{type:string, val:any|null}};
  private _fn_afterBind:any = null;
  constructor(name:string, shaderName="custom", scene?:Scene) {
    super(name, scene);
    this._customAttributes = [];
    this._customSamplers = {};
    this._customUniforms = {};
    let sn = shaderName;
    this.customShaderNameResolve = (shaderName: string, uniforms: string[], uniformBuffers: string[], samplers: string[], defines: MaterialDefines | string[], attributes?: string[], options?: ICustomShaderNameResolveOptions) => {
      /*
      if(attributes && this._customAttributes.length > 0) {
        attributes.push(...this._customAttributes);
      }
        */
      this.ReviewUniform(uniforms);
      this.ReviewSampler(samplers);
      if(!this._fn_afterBind) {
        this._fn_afterBind = this._afterBind.bind(this);
        this._afterBind = (m, e, sm) => {
          if(!e) {
            return;
          }
          this.AttachAfterBind(m, e);
          try {
            this._fn_afterBind(m, e, sm);
          }
          catch(e) {}
        };
      }
      return sn;
    }
    console.log("aghoahogahogahog");
    this.AddUniform("test", "float", 0.5);
  }
  private AttachAfterBind(mesh:AbstractMesh|undefined, effect:Effect) {
    for(const[key, value] of Object.entries(this._customSamplers)) {
      if(value.type == "sampler2D" && value.val != null && value.val.isReady && value.val.isReady()) {
        effect.setTexture(key, value.val);
      }
    }
    for(const[key, value] of Object.entries(this._customUniforms)) {
      if(value.val != null) {
        if(value.type == "vec2") {
          effect.setVector2(key, value.val);
        }
        else if(value.type == "vec3") {
          effect.setVector3(key, value.val);
        }
        else if(value.type == "vec4") {
          effect.setVector4(key, value.val);
        }
        else if(value.type == "mat4") {
          effect.setMatrix(key, value.val);
        }
        else if(value.type == "float") {
          effect.setFloat(key, value.val);
        }
      }
    }
  }
  private ReviewUniform(uniforms:string[]) {
    uniforms.push(...Object.keys(this._customUniforms));
  }
  private ReviewSampler(samplers:string[]) {
    samplers.push(...Object.keys(this._customSamplers));
  }
  public AddUniform(name:string, kind:string, param: any):CustomMaterial {
    if(kind.indexOf("sampler") != -1) {
      this._customSamplers[name] = {type:kind, val:param};
    }
    else {
      this._customUniforms[name] = {type:kind, val:param};
    }
    return this;
  }
  public AddAttribute(name:string):CustomMaterial {
    this._customAttributes.push(name);
    return this;
  }
  public isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean {
    console.log("teatteataeteata");
    if(!subMesh.materialDefines) {
      subMesh.materialDefines = new StandardMaterialDefines(this._eventInfo.defineNames);
    }
    return super.isReadyForSubMesh(mesh, subMesh, useInstances);
  }
}