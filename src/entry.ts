import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { CustomMaterial } from "./material/customMaterial";

let canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;

let engine = new Engine(canvas, true, {
  audioEngine: false
});

const startScene = async () => {
  const scene = new Scene(engine);
  const sortfunc = (a:any, b:any) => a.sortkey < b.sortkey ? -1 : a.sortkey > b.sortkey ? 1 : 0;
  scene.setRenderingOrder(0, sortfunc, sortfunc, sortfunc);
  scene.clearColor = new Color4(0,0,0,0);
  scene.ambientColor = Color3.Black();
  scene.createDefaultEnvironment({
    createSkybox: false,
    createGround: true,
    groundColor:Color3.Yellow()
  });
  let camera = new ArcRotateCamera("camera", 1, 0.8, 20,  new Vector3(0, 1, 0), scene);
  camera.attachControl(canvas, true);
  new HemisphericLight("light1", new Vector3(0,0,1), scene);
  let sphere = MeshBuilder.CreateSphere("sphere", {segments:32, diameter:2}, scene);
  let customMaterial = new CustomMaterial("custom", scene);
  sphere.material = customMaterial;
  engine.runRenderLoop(() => {
    scene.render();
  });
}
startScene();

window.addEventListener("resize", () => {
  engine.resize();
});