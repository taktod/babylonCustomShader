import { AbstractMesh, ICustomShaderNameResolveOptions, MaterialDefines, Scene, StandardMaterial, StandardMaterialDefines, SubMesh } from "@babylonjs/core"

import "./shader/customVert.glsl";
import "./shader/customFrag.glsl";

export class CustomMaterial extends StandardMaterial {
  protected shaderName:string = "custom";
  private _customAttributes: string[];
  constructor(name:string, scene?:Scene) {
    super(name, scene);
    this._customAttributes = [];
    this.customShaderNameResolve = (shaderName: string, uniforms: string[], uniformBuffers: string[], samplers: string[], defines: MaterialDefines | string[], attributes?: string[], options?: ICustomShaderNameResolveOptions) => {
      if(attributes && this._customAttributes.length > 0) {
        attributes.push(...this._customAttributes);
      }
      return this.shaderName;
    }
  }
  public AddAttribute(name:string):CustomMaterial {
    this._customAttributes.push(name);
    return this;
  }
  public isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean {
    if(!subMesh.materialDefines) {
      subMesh.materialDefines = new StandardMaterialDefines(this._eventInfo.defineNames);
    }
    return super.isReadyForSubMesh(mesh, subMesh, useInstances);
  }
}