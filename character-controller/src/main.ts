import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

window.addEventListener("load", () => {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 5, 20);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;

  const loadingManager = new THREE.LoadingManager();

  const gltfLoader = new GLTFLoader(loadingManager);

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    document
      .querySelector("#progress-bar")
      ?.setAttribute("value", `${(itemsLoaded / itemsTotal) * 100}`);

    if (itemsLoaded === itemsTotal) {
      document.querySelector("#progress-bar-container")?.remove();
    }
  };

  const gltf = await gltfLoader.loadAsync("./model/character.gltf");

  const model = gltf.scene;

  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name === "vanguard_visor") {
      child.parent?.remove(child);
      console.log(child.name);
      console.log(child.material);
    }
  });
  model.scale.set(0.1, 0.1, 0.1);
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);

  const action = mixer.clipAction(gltf.animations[0]);

  action.play();

  const clock = new THREE.Clock();

  camera.lookAt(model.position);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  hemisphereLight.position.set(0, 20, 10);
  scene.add(hemisphereLight);

  render();

  function render() {
    controls.update();
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}
