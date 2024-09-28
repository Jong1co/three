# Three.js의 기본 구성요소

- renderer
  - camera에 scene에 담았다면 그 것을 랜더러가 화면에 출력해줌
- camera: scene 담을 곳
- scene: 장면
  - 장면을 담기 위해 Mesh, object, light 등 3차원 요소로 표현됨
  - 3d object

# 1-CUBE

- mesh를 생성하고, 위치를 설정하지 않으면 3차원 공간의 원점을 가리키게 됨
- three js의 3차원 공간은 x축(좌우), y축(상하), z출(앞뒤)로 구성되어 있음
- 모든 건(camera, 3dobject) scene에 추가된 후, renderer에 의해 화면에 출력되는 듯
