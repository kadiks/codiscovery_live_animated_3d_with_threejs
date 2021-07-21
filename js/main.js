const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let textMesh;
let phoneScene;
let cpuScene;
let mouseScene;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xdcdcdc, 1);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (textMesh) {
    // textMesh.rotation.x += 0.01;
    // textMesh.rotation.y += 0.01;
  }

  if (phoneScene) {
    phoneScene.rotation.z += 0.01;
  }

  if (cpuScene) {
    cpuScene.rotation.y += 0.01;
  }

  if (mouseScene) {
    mouseScene.rotation.y += 0.01;
    mouseScene.rotation.x += 0.01;
  }

  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
};

animate();

const ambientLight = new THREE.AmbientLight(0xfffff, 0.5);
const pointLight = new THREE.PointLight(0xfffff, 0.5);
pointLight.position.set(0, 0.5, 0);
pointLight.castShadow = true;

scene.add(ambientLight);
scene.add(pointLight);

const loader = new THREE.FontLoader();

// loader.load(path:URL:String, callback:Function)

loader.load("/fonts/fugaz.typeface.json", (font) => {
  const geometry = new THREE.TextGeometry(
    "Codiscovery", // est dans la place : tout baigne
    {
      font,
      size: 5,
      height: 4,
      curveSegments: 13,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 3,
    }
  );
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  textMesh = new THREE.Mesh(geometry, material);

  const textScale = 0.09;
  textMesh.scale.set(textScale, textScale, textScale);

  textMesh.position.set(-1.8, 0, 0);

  scene.add(textMesh);
});

const loadModel = ({ path, scale, position = [], rotation = {} }) => {
  return new Promise((resolve) => {
    const loader = new THREE.GLTFLoader();
    loader.load(path, (gltf) => {
      gltf.scene.scale.set(scale, scale, scale);

      const rotationKeys = Object.keys(rotation);
      for (let axis of rotationKeys) {
        gltf.scene.rotation[axis] = rotation[axis];
      }

      // gltf.scene.position.set.apply(this, position);
      gltf.scene.position.set(position[0], position[1], position[2]);

      resolve(gltf.scene);
    });
  });
};

const phoneInfo = {
  path: "/models/phone/scene.gltf",
  scale: 0.025,
  position: [0, 3, -3],
  rotation: {
    x: 1.5,
  },
};

const mouseInfo = {
  path: "/models/mouse/scene.gltf",
  scale: 0.1,
  position: [-2, -3, -3],
};
const cpuInfo = {
  path: "/models/mac/scene.gltf",
  scale: 0.5,
  position: [1, -3, -3],
};

(async () => {
  phoneScene = await loadModel(phoneInfo);
  scene.add(phoneScene);

  cpuScene = await loadModel(cpuInfo);
  scene.add(cpuScene);

  mouseScene = await loadModel(mouseInfo);
  scene.add(mouseScene);
})();
