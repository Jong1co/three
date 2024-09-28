import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

window.addEventListener("load", () => {
  init();
});

async function init() {
  const options = {
    color: 0x00fff,
  };

  // 우리가 만들 장면을 렌더링할 렌더러를 생성합니다.
  // canvas dom 요소가 들어있음
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // Mesh의 표면이 거침 (렌더러의 속성을 통해 보정함)
  });

  // 랜더러를 document에 추가함
  document.body.appendChild(renderer.domElement);

  // 컨텐츠를 보여줄 화면의 크기 설정
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputColorSpace = THREE.SRGBColorSpace;

  // scene 추가
  const scene = new THREE.Scene();

  /**
   * PerspectiveCamera: 원근 카메라
   */
  const camera = new THREE.PerspectiveCamera(
    75, // fov: Field of View, 시야각
    window.innerWidth / window.innerHeight, // 카메라의 종횡비
    1, // near: 카메라의 가까운 면
    500 // far: 카메라의 먼 면
  );

  const geometry = new THREE.IcosahedronGeometry(1);
  const skeletonGeometry = new THREE.IcosahedronGeometry(2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 드래그 관성
  controls.maxDistance = 50;
  controls.minDistance = 10;
  // controls.autoRotate = true;

  // const axesHelper = new THREE.AxesHelper(5);

  // scene.add(axesHelper);

  // geometry의 모서리를 표현
  // const edge = new THREE.EdgesGeometry(geometry);
  // const line = new THREE.LineSegments(
  //   edge,
  //   new THREE.LineBasicMaterial({ color: 0xffffff })
  // );
  // scene.add(line);

  // MeshBasicMaterial은 조명에 영향을 받지 않기 때문에, 조명이 없어도 화면에 잘 보이고, 조명이 있어도 영향을 받지 않음
  // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff });
  const material = new THREE.MeshLambertMaterial({
    color: 0x00fffff,
    emissive: 0x111111,
    // transparent: true, // 투명도를 표현하기 위해서 true로 설정되어야 함
    // opacity: 0.5, // transparent가 true일 경우에만 적용되는 투명도
  });

  const skeletonMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
    transparent: true, // 투명도를 표현하기 위해서 true로 설정되어야 함
    opacity: 0.2, // transparent가 true일 경우에만 적용되는 투명도
  });

  const cube = new THREE.Mesh(geometry, material);
  const skeletonCube = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
  scene.add(cube, skeletonCube);

  //카메라의 포지션을 보여줌
  camera.position.set(0, 0, 5);

  // cube의 포지션을 바라봐라!
  // 중앙에 나오도록 해줌
  // camera.lookAt(cube.position);

  // 직접조명
  const directionalLight = new THREE.DirectionalLight(
    0xffffff, // 조명의 색상
    1 // 조명의 강도
  );

  // 조명의 포지션
  // directionalLight.position.set(-1, 2, 3);

  scene.add(directionalLight);

  // 은은한 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  ambientLight.position.set(3, 2, 1);

  scene.add(ambientLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    skeletonCube.rotation.x = elapsedTime * 1.5;
    skeletonCube.rotation.y = elapsedTime * 1.5;
    // line.rotation.x = clock.getElapsedTime();

    // line.rotation.y = Math.sin(cube.rotation.x);

    // cube.scale.x = Math.sin(cube.rotation.x);
    // line.scale.x = Math.sin(cube.rotation.x);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // 카메라 속성을 변경한 뒤 무조건 호출해 주어야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);

  const gui = new GUI();

  gui //
    .add(cube.position, "y")
    .min(-3)
    .max(3)
    .step(0.1);

  gui.add(cube, "visible");

  gui.addColor(options, "color").onChange((color: number) => {
    cube.material.color.set(color);
  });
}
