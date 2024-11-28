// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0000);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,              // 시야각 (FOV)
  window.innerWidth / window.innerHeight, // 종횡비 (aspect ratio)
  0.1,             // 가까운 가시 거리 (near)
  1000000          // 먼 가시 거리 (far)
);

// Position the camera
camera.position.set(20000, 10000, 0);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.enableDamping = true; // 마우스 움직임에 따른 부드러운 감속 효과
controls.dampingFactor = 0.5; // 감속 강도 설정


// Create a Sun
const STexture = new THREE.TextureLoader().load('태양.png');
const Sgeometry = new THREE.SphereGeometry(696, 60, 60);
const Smaterial = new THREE.MeshStandardMaterial({ emissive: 0xffcc00 , map:STexture});
const Sun = new THREE.Mesh(Sgeometry, Smaterial);
scene.add(Sun);

const pointLight = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight.position.set(0, 1100, 0); // 태양 중심에 빛 배치
pointLight.power = (70)
pointLight.distance = 100000
scene.add(pointLight);
const pointLight1 = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight1.position.set(0, -1100, 0); // 태양 중심에 빛 배치
pointLight1.power = (70)
pointLight1.distance = 100000
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight2.position.set(1100, 0, 0); // 태양 중심에 빛 배치
pointLight2.power = (70)
pointLight2.distance = 2000
scene.add(pointLight2);
const pointLight3 = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight3.position.set(-1100, 0, 0); // 태양 중심에 빛 배치
pointLight3.power = (70)
pointLight3.distance = 2000
scene.add(pointLight3);
const pointLight4 = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight4.position.set(0, 0, 1100); // 태양 중심에 빛 배치
pointLight4.power = (70)
pointLight4.distance = 2000
scene.add(pointLight4);
const pointLight5 = new THREE.PointLight(0xffffff, 1, 100000000);
pointLight5.position.set(0, 0, -1100); // 태양 중심에 빛 배치
pointLight5.power = (70)
pointLight5.distance = 2000
scene.add(pointLight5);

// 행성 생성 함수 수정
function createPlanet(size, color, distance, orbitSpeed) {
  const planetGroup = new THREE.Group(); // 공전 그룹
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({color});
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.position.x = distance; // 행성 위치 설정
  planetGroup.add(planet);
  scene.add(planetGroup);

  return { planet, planetGroup, orbitSpeed }; // 공전 속도 포함
}

function createEllipse(scene, x, y, xRadius, yRadius, color, pointsCount = 100) {
  // 선 재질
  const material = new THREE.LineBasicMaterial({ color });

  // 타원 경로 생성
  const curve = new THREE.EllipseCurve(
      x, y,                 // 타원의 중심 좌표
      xRadius, yRadius,     // x축, y축 반지름
      0, 2 * Math.PI,       // 0~360도
      false,                // 시계 방향
      0                     // 회전
  );
  const points = curve.getPoints(pointsCount); // 지정된 개수만큼 점 생성
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI /2
  scene.add(ellipse);
  return ellipse; // 필요하면 반환
}

// 행성들 추가 
const planets = [
  createPlanet(24*3, 0xaaaaaa, 3900, 0.0048),  // 수성
  createPlanet(60.51*3, 0xff8800, 7200, 0.0035),  // 금성
  createPlanet(63.78*3, 0x0000ff, 10000, 0.0030),  // 지구
  createPlanet(33.89*3, 0xff0000, 15200, 0.0024), // 화성
  createPlanet(669*2, 0xf2cb61, 52000, 0.0013),  // 목성
  createPlanet(582*2, 0xfaecc5, 95800, 0.00096),  // 토성
  createPlanet(253*2, 0x6900ff, 192000, 0.00067),  // 천
  createPlanet(246*2, 0x4641d9, 300000, 0.00054), // 해
];

createEllipse(scene, 0, 0, 3900, 3900, 0x6666);
createEllipse(scene, 0, 0, 7200, 7200, 0x6666);
createEllipse(scene, 0, 0, 10000, 10000, 0x6666);
createEllipse(scene, 0, 0, 15200, 15200, 0x6666);
createEllipse(scene, 0, 0, 52000, 52000, 0x6666);
createEllipse(scene, 0, 0, 95800, 95800, 0x6666);
createEllipse(scene, 0, 0, 192000, 192000, 0x6666);
createEllipse(scene, 0, 0, 300000, 300000, 0x6666);

const moonGeometry = new THREE.SphereGeometry(63.78*5*0.27, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);
let moonOrbitRadius = 1000;
let moonAngle = 0;
const moonOrbitSpeed = 40; // 테스트 값: 1000m/s
const moonAngularSpeed = moonOrbitSpeed / moonOrbitRadius; // 각속도 계산

const earthData = planets[2]; // 지구 데이터
const earth = earthData.planet; // 지구 Mesh에 접근
const earthWorldPosition = new THREE.Vector3();
earth.getWorldPosition(earthWorldPosition);
const MarsData = planets[3];
const Mars = MarsData.planet; 
const MarsWorldPosition = new THREE.Vector3();
Mars.getWorldPosition(MarsWorldPosition);

const dashedMaterial = new THREE.LineDashedMaterial({
  emissive: 0xffffff,       // 점선 색상
  dashSize: 50,         // 점선 길이
  gapSize: 300      // 점선 간격
});

function createDashedLine(start, direction, length) {
  let end = new THREE.Vector3().copy(direction).normalize().multiplyScalar(length).add(start);
  let points = [start, end];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // 점선의 거리 계산
  const line = new THREE.Line(lineGeometry, dashedMaterial);
  line.computeLineDistances(); // 점선 적용 필수 호출
  return line;
}

const EtargetDirection = new THREE.Vector3(0, 0, -1);
let EdashedLine = createDashedLine(earthWorldPosition, EtargetDirection, 30000);
scene.add(EdashedLine);

const StargetDirection = new THREE.Vector3(0, 0, -1);
let SdashedLine = createDashedLine(Sun.position,StargetDirection, 30000);
scene.add(SdashedLine);

let targetDirection = new THREE.Vector3(MarsWorldPosition.x, 0, MarsWorldPosition.z);
const lineLength = 30000;
let dashedLine = createDashedLine(earthWorldPosition, targetDirection, lineLength);
scene.add(dashedLine);

let targetDirection2 = new THREE.Vector3(earthWorldPosition.x, 0, earthWorldPosition.z);
const lineLength2 = 15000;
let dashedLine2 = createDashedLine(Sun.position, targetDirection, lineLength2);
scene.add(dashedLine2);

// 부채꼴 초기화 함수
function createFanes() {
    const geometry1 = new THREE.CircleGeometry(600, 32, Math.PI / 2, -Math.PI); // 180도 부채꼴
    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    circle1 = new THREE.Mesh(geometry1, material1);
    scene.add(circle1);
    circle1.rotation.x = -Math.PI / 2; // 수평으로 회전

    const geometry2 = new THREE.CircleGeometry(900, 32, Math.PI / 2, -Math.PI); // 180도 부채꼴
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    circle2 = new THREE.Mesh(geometry2, material2);
    scene.add(circle2);
    circle2.rotation.x = -Math.PI / 2; // 수평으로 회전
}

// 부채꼴 업데이트 함수
function updateFans() {
  // 지구와 화성의 위치 업데이트
  earth.getWorldPosition(earthWorldPosition);
  Mars.getWorldPosition(MarsWorldPosition);

  // 지구-화성 방향 벡터
  const vectorToMars = new THREE.Vector3().subVectors(MarsWorldPosition, earthWorldPosition); // 지구에서 화성까지의 방향 벡터

  // angle1: 지구를 중심으로 -z축과 화성 간의 각도 계산
  const angle1 = Math.atan2(vectorToMars.x, -vectorToMars.z); // -z 방향을 기준으로 계산
  const angleInDegrees1 = angle1 * (180 / Math.PI); // 도 단위로 변환

  // 태양의 위치 업데이트
  const sunWorldPosition = new THREE.Vector3();
  Sun.getWorldPosition(sunWorldPosition);

  // 태양-지구 방향 벡터
  const vectorToEarth = new THREE.Vector3().subVectors(earthWorldPosition, sunWorldPosition); // 태양에서 지구까지의 방향 벡터

  // angle2: 태양을 중심으로 -z축과 지구 간의 각도 계산
  const angle2 = Math.atan2(vectorToEarth.x, -vectorToEarth.z); // -z 방향을 기준으로 계산
  const angleInDegrees2 = angle2 * (180 / Math.PI); // 도 단위로 변환

  // 부채꼴의 각도 업데이트
  if (angle1 < 0){
    circle1.geometry = new THREE.RingGeometry(300, 600, 32, 32, Math.PI / 2, -angle1); // 부채꼴의 각도 업데이트
  }
  else if (angle1 >= 0){
    circle1.geometry = new THREE.RingGeometry(300, 600, 32, 32, Math.PI / 2, 2*Math.PI-angle1); // 부채꼴의 각도 업데이트
  }
  
  if (angle2 < 0){
    circle2.geometry = new THREE.RingGeometry(800, 1100, 32, 32, Math.PI / 2, -angle2); // 부채꼴의 각도 업데이트
  }
  else if (angle2 >= 0){
    circle2.geometry = new THREE.RingGeometry(800, 1100, 32, 32, Math.PI / 2, 2*Math.PI-angle2); // 부채꼴의 각도 업데이트
  }
}

const geometry3 = new THREE.CircleGeometry(900, 32, 0, 2*Math.PI); // 180도 부채꼴
const material3 = new THREE.MeshStandardMaterial({ color: 0xfaecc5, side: THREE.DoubleSide});
circle = new THREE.Mesh(geometry3, material3);
circle.geometry = new THREE.RingGeometry(2000, 3000, 32, 32, 0, Math.PI*2); 
scene.add(circle)
circle.rotation.x = Math.PI/2

// Animate the cube
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(({ planetGroup, orbitSpeed }) => {
    planetGroup.rotation.y += orbitSpeed; // 공전 속도 적용
  });
  Sun.rotation.y += 360/27000

  const earthData = planets[2]; // 지구 데이터
  const earth = earthData.planet; // 지구 Mesh에 접근
  const earthWorldPosition = new THREE.Vector3();
  earth.getWorldPosition(earthWorldPosition);

  const MarsData = planets[3];
  const Mars = MarsData.planet; 
  const MarsWorldPosition = new THREE.Vector3();
  Mars.getWorldPosition(MarsWorldPosition);

  moonAngle -= moonAngularSpeed; // 각속도에 따라 각도 업데이트
  moonAngle %= 2 * Math.PI; // 한 바퀴를 넘으면 초기화
  moon.position.x = earthWorldPosition.x + moonOrbitRadius * Math.cos(moonAngle);
  moon.position.z = earthWorldPosition.z + moonOrbitRadius * Math.sin(moonAngle);
  moon.position.y = earthWorldPosition.y; // 지구와 동일한 높이 유지
  controls.update();
  renderer.render(scene, camera);

  EdashedLine.position.x = earthWorldPosition.x - 10000
  EdashedLine.position.z = earthWorldPosition.z 
  
  dashedLine.position.x = earthWorldPosition.x - 10000
  dashedLine.position.z = earthWorldPosition.z
  
  earth.getWorldPosition(earthWorldPosition);
  Mars.getWorldPosition(MarsWorldPosition);

  const sunWorldPosition = new THREE.Vector3();
  Sun.getWorldPosition(sunWorldPosition);
  
  const direction2 = new THREE.Vector3().subVectors(earthWorldPosition, sunWorldPosition).normalize();
  const startPoint2 = sunWorldPosition.clone();
  const endPoint2 = startPoint2.clone().add(direction2.multiplyScalar(lineLength2));
  dashedLine2.geometry.setFromPoints([startPoint2, endPoint2]);
  dashedLine2.computeLineDistances();
  dashedLine2.geometry.verticesNeedUpdate = true;
  dashedLine2.position.set(0, 0, 0);
  dashedLine2.updateMatrix();

  const direction = new THREE.Vector3().subVectors(MarsWorldPosition, earthWorldPosition).normalize();
  const startPoint = earthWorldPosition.clone();
  const endPoint = startPoint.clone().add(direction.multiplyScalar(lineLength));
  dashedLine.geometry.setFromPoints([startPoint, endPoint]);
  dashedLine.geometry.verticesNeedUpdate = true;
  dashedLine.position.set(0, 0, 0);
  dashedLine.updateMatrix();
  
  earth.getWorldPosition(earthWorldPosition);
  circle1.position.x = earthWorldPosition.x
  circle1.position.z = earthWorldPosition.z
  updateFans();
  renderer.render(scene, camera);

  const ToData = planets[5];
  const To = ToData.planet; 
  const ToWorldPosition = new THREE.Vector3();
  To.getWorldPosition(ToWorldPosition);
  circle.position.x = ToWorldPosition.x
  circle.position.z = ToWorldPosition.z
}
createFanes();
animate();

let a = 0; // 스페이스바 동작 여부를 제어하는 변수

function drawLine(startX, startZ, endX, endZ) {
  const geometry9 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(startX, 0, startZ),
    new THREE.Vector3(endX, 0, endZ),
  ]);
  const material9 = new THREE.LineBasicMaterial({ color: 0xffffff  });
  const line9 = new THREE.Line(geometry9, material9);
  scene.add(line9);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && a === 0) {
    earth.getWorldPosition(earthWorldPosition);
    Mars.getWorldPosition(MarsWorldPosition);
    Sun.getWorldPosition(sunWorldPosition);

    drawLine(earthWorldPosition.x, earthWorldPosition.z, MarsWorldPosition.x, MarsWorldPosition.z);
    drawLine(sunWorldPosition.x, sunWorldPosition.z, earthWorldPosition.x, earthWorldPosition.z);

    console.log('스페이스바 동작 완료. 더 이상 실행되지 않습니다.');
    a = 1; // 이후 실행을 차단
  }
}); 

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyR') { // R키로 초기화
    a = 0;
    console.log('a가 초기화되었습니다.');
  }
});