import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as dat from "dat.gui";
import * as TWEEN from "tween.js";

document.addEventListener("DOMContentLoaded", function () {
  var scene = new THREE.Scene();

  var aspect = window.innerWidth / window.innerHeight;
  var d = 2.3;
  var camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    1,
    1000
  );
  camera.position.set(4, 3, 3);
  camera.lookAt(scene.position);

  var renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x141a35);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Texture Loader
  var textureLoader = new THREE.TextureLoader();

  // Loader
  var loader = new GLTFLoader();

  // Controls for animations
  var controls = {
    catAnimation: true,
  };

  // GUI
  var gui = new dat.GUI();

  // // Confetti Control
  var confettiControl = { confetiiEffect: false };
  gui.add(confettiControl, "confetiiEffect").name("Toggle Confetti");

  // Door Control
  var doorControl = { isOpen: false };
  gui.add(doorControl, "isOpen").name("Open Door");

  // Lamp Light Control
  var lampLightControl = { lampLightOn: false };
  var lampLightCheckbox = gui
    .add(lampLightControl, "lampLightOn")
    .name("Toggle Lamp Light");

  // Camera control
  var cameraControl = { viewOtherSide: false, monitorView: false };

  // Control - other side perspective
  var cameraToggle = gui
    .add(cameraControl, "viewOtherSide")
    .name("Bedroom View");

  // Monitor Screen
  var monitorViewToggle = gui
    .add(cameraControl, "monitorView")
    .name("Monitor View");

  // Control fish animation
  var fishAnimationControl = { startAnimation: false };
  var fishAnimationToggle = gui
    .add(fishAnimationControl, "startAnimation")
    .name("Fish Swimming");

  // Fan Control
  var fanControl = { fanAnimation: false };
  var fanAnimationToggle = gui
    .add(fanControl, "fanAnimation")
    .name("Start Cooling");

  // Listen for changes in the camera view toggle

  // Monitor control
  var videoControl = { playVideo: false };
  var videoToggle = gui.add(videoControl, "playVideo").name("Start PC");

  // Load the floor texture
  var floorTexture = textureLoader.load("models/floor-texture/parquet.jpg");

  // Create a material with the loaded texture
  var planeMaterial = new THREE.MeshStandardMaterial({
    emissive: 0x141a35,
    side: THREE.DoubleSide,
    map: floorTexture,
  });

  // Create a simple plane
  var planeGeometry = new THREE.PlaneGeometry(3, 4.35, 1, 1);
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Load the carpet texture
  var carpetTexture = textureLoader.load("models/carpet-texture/carpet.jpg");

  // Create a material with the loaded texture
  var carpetMaterial = new THREE.MeshStandardMaterial({
    emissive: 0x141a35,
    side: THREE.DoubleSide,
    map: carpetTexture,
  });

  // Create a carpet
  var carpetGeometry = new THREE.PlaneGeometry(1.75, 1.5, 1, 1);
  var carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, 1);
  scene.add(carpet);

  // Create a table
  var tableGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  var tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  var table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.set(0, 0.1, 1);
  scene.add(table);

  /**
   * Walls
   */

  // Create a wall
  var wallGeometry = new THREE.BoxGeometry(0.2, 1.5, 2.2);
  var wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  var wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(-0.3, 0.8, -0.15);
  wall.rotation.set(0, Math.PI / 2, 0);
  scene.add(wall);

  // Create wall two
  const wallTwoGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
  var wallTwo = new THREE.Mesh(wallTwoGeometry, wallMaterial);
  wallTwo.position.set(1.45, 0.75, -0.175);
  wallTwo.rotation.set(0, Math.PI / 2, 0);
  scene.add(wallTwo);

  // Create wall three - z-axis wall
  var wallThreeGeometry = new THREE.BoxGeometry(0.2, 1.5, 2.5);
  var wallThreeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

  var wallThree = new THREE.Mesh(wallThreeGeometry, wallThreeMaterial);
  wallThree.position.set(-1.475, 0.8, 1);
  scene.add(wallThree);

  /**
   * Transparent Walls
   */

  var transparentWallGeometry = new THREE.BoxGeometry(0.2, 1.5, 2.5);
  var transparentWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    transparent: true,
    opacity: 0.5,
  });

  var transparentWall = new THREE.Mesh(
    transparentWallGeometry,
    transparentWallMaterial
  );
  transparentWall.position.set(-1.475, 0.8, -1);
  scene.add(transparentWall);

  scene.add(transparentWall);

  // Load the painting texture
  var northumbriaTexture = textureLoader.load(
    "models/northumbria-painting-texture/northumbria-uni.png"
  );

  // Create a material with the loaded texture - painting
  var northumbriaMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: northumbriaTexture,
  });

  // Create a  wall painting
  var northumbriaGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  var northumbria = new THREE.Mesh(northumbriaGeometry, northumbriaMaterial);

  // Position the painting
  northumbria.position.set(-1.25, 0.85, 1.15);

  // Rotate the painting towards the parallel wall
  northumbria.rotation.set(0, Math.PI / 2, 0);

  scene.add(northumbria);

  // Load the door model or texture
  var doorTexture = textureLoader.load("models/door-texture/door.jpg");

  // Flip the door texture horizontally
  doorTexture.wrapS = THREE.RepeatWrapping;
  doorTexture.repeat.x = -1;

  var doorMaterial = new THREE.MeshStandardMaterial({
    map: doorTexture,
    side: THREE.DoubleSide,
  });

  // Create the door mesh
  var doorGeometry = new THREE.BoxGeometry(0.6, 1.51, 0.1);
  var door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0.325, 0, 0);
  scene.add(door);

  // Set the initial rotation angle of the door based on doorControl.isOpen
  var initialDoorRotation = doorControl.isOpen ? -Math.PI / 2 : 0;

  // Create a group to hold the door and set its position as the pivot point's position
  var pivotGroup = new THREE.Group();
  pivotGroup.position.set(0.75, 0.7, -0.15);
  pivotGroup.rotation.set(0, initialDoorRotation, 0);
  scene.add(pivotGroup);

  // Add the door to the group
  pivotGroup.add(door);

  // Create a small box geometry for the door frame (which acts as the pivot point)
  var pivotGeometry = new THREE.BoxGeometry(0.1, 1.51, 0.5);

  // Create a material for the door frame (which acts as the pivot point)
  var pivotMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    visible: false,
  });

  // Create a mesh using the custom geometry and material
  var pivotPoint = new THREE.Mesh(pivotGeometry, pivotMaterial);

  // Set the position of the pivot point
  pivotPoint.position.set(0.85, 0.7, -0.1);

  // Add the pivot point to the scene
  scene.add(pivotPoint);

  // Update door state based on GUI control
  if (doorControl.isOpen) {
    // Code to open the door without animation (initial state)
    pivotGroup.rotation.y = -Math.PI / 2;
  }

  // Load the flower model
  var flower;
  loader.load("models/flower/scene.gltf", function (gltf) {
    flower = gltf.scene;
    flower.position.set(1.25, 0, 1.9);
    flower.scale.set(0.1, 0.1, 0.1);
    flower.rotation.set(0, Math.PI / 1.5, 0);

    scene.add(flower);
  });

  // Load the statue model
  var statue;
  loader.load("models/statue/scene.gltf", function (gltf) {
    statue = gltf.scene;
    statue.position.set(0.05, 0, 0.05);
    statue.scale.set(0.01, 0.01, 0.01);
    statue.rotation.set(0, Math.PI / 1, 0);

    scene.add(statue);
  });

  // Load the chair model
  var chair;
  loader.load("models/chair/scene.gltf", function (gltf) {
    chair = gltf.scene;
    chair.position.set(-0.15, 0, 1.6);
    chair.scale.set(0.045, 0.045, 0.045);
    chair.rotation.set(0, Math.PI / 1.5, 0);

    scene.add(chair);
  });

  // Load the book shelf model
  var bookShelf;
  loader.load("models/book-shelf/scene.gltf", function (gltf) {
    bookShelf = gltf.scene;
    bookShelf.position.set(-0.9, 0.1, 0.2);
    bookShelf.scale.set(0.5, 0.5, 0.75);

    scene.add(bookShelf);
  });

  // Load the wood table model
  var woodTable;
  loader.load("models/wood-table/scene.gltf", function (gltf) {
    woodTable = gltf.scene;
    woodTable.position.set(-0.6, 0.05, 0.05);
    woodTable.scale.set(0.4, 0.4, 0.4);

    scene.add(woodTable);
  });

  // Load the tools model
  var tools;
  loader.load("models/tools/scene.gltf", function (gltf) {
    tools = gltf.scene;
    tools.position.set(-0.33, 0.35, 0.125);
    tools.scale.set(0.00008, 0.00008, 0.00008);

    scene.add(tools);
  });

  // Load monitor video
  var monitorVideo = document.createElement("video");
  monitorVideo.src = "models/monitor-video/video.mp4";
  monitorVideo.loop = true;
  monitorVideo.width = "300px";
  monitorVideo.height = "300px";
  monitorVideo.muted = true; // Mute the video initially
  monitorVideo.load(); // Load the video

  // Create a video texture for the monitor
  var videoTexture = new THREE.VideoTexture(monitorVideo);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var videoPlane;

  // Listen for changes in the video playback control
  videoToggle.onChange(function (value) {
    if (value) {
      // Play the video
      monitorVideo.play();
      // Add the video plane to the scene
      scene.add(videoPlane);
    } else {
      // Pause the video
      monitorVideo.pause();
      // Remove the video plane from the scene
      scene.remove(videoPlane);
    }
  });

  // Load monitor
  var monitor;
  loader.load("models/monitor/scene.gltf", function (gltf) {
    monitor = gltf.scene;
    monitor.position.set(0, 0.3, 1);
    monitor.scale.set(0.4, 0.4, 0.4);
    monitor.rotation.set(0, Math.PI / 1, 0); // Rotate the monitor 90 degrees around the y-axis

    scene.add(monitor);

    // Create a plane for the video
    var videoPlaneGeometry = new THREE.PlaneGeometry(0.33, 0.235);
    var videoPlaneMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });
    videoPlane = new THREE.Mesh(videoPlaneGeometry, videoPlaneMaterial);
    videoPlane.position.set(0, 0.3, 0.89);

    // Offset the position to align the video plane properly
    videoPlane.translateY(0.16);

    // Initial state: add the video plane to the scene only if the video control is toggled
    if (videoControl.playVideo) {
      scene.add(videoPlane);
    } else {
      scene.remove(videoPlane);
    }
  });

  // Load Floor Lamp
  var floorLamp;
  loader.load("models/floor-lamp/scene.gltf", function (gltf) {
    floorLamp = gltf.scene;
    floorLamp.position.set(-1, 0, 1.95);
    floorLamp.scale.set(0.55, 0.4, 0.4);
    floorLamp.rotation.set(0, Math.PI / 2.3, 0); // Rotate the monitor 90 degrees around the y-axis

    scene.add(floorLamp);
  });

  // Load Floor Lamp
  var armchair;
  loader.load("models/armchair/scene.gltf", function (gltf) {
    armchair = gltf.scene;
    armchair.position.set(1.25, 0, -1.9);
    armchair.scale.set(0.55, 0.4, 0.4);
    armchair.rotation.set(0, -Math.PI / 2.3, 0); // Rotate the monitor 90 degrees around the y-axis

    scene.add(armchair);
  });

  /**
   * Bed Room Setup
   */

  // Load Bed
  var bed;
  loader.load("models/bed/scene.gltf", function (gltf) {
    bed = gltf.scene;
    bed.position.set(0, 0.02, -0.7);
    bed.scale.set(0.45, 0.4, 0.4);
    bed.rotation.set(0, -Math.PI / 1, 0); // Rotate the monitor 90 degrees around the y-axis

    scene.add(bed);
  });

  // Load Wardrobe
  var wardrobe;
  loader.load("models/wardrobe/scene.gltf", function (gltf) {
    wardrobe = gltf.scene;

    wardrobe.position.set(-1, 0.02, -0.4);
    wardrobe.rotation.set(0, Math.PI / 1, 0);

    wardrobe.scale.set(0.006, 0.006, 0.006);

    scene.add(wardrobe);
  });

  // Create a table for the aquarium
  var tableGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  var tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  var table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.set(-1, 0.2, -2);
  scene.add(table);

  // Load the fish
  var fish;

  loader.load("models/fish/scene.gltf", function (gltf) {
    fish = gltf.scene;
    fish.position.set(0, 0.025, 0);
    fish.scale.set(0.00035, 0.00035, 0.00035);

    aquarium.add(fish);
  });

  // Load the aquarium model
  var aquarium;
  loader.load("models/aquarium/scene.gltf", function (gltf) {
    aquarium = gltf.scene;
    aquarium.position.set(-1, 0.4, -1.975);
    aquarium.scale.set(5.7, 5.7, 5.7);

    scene.add(aquarium);
  });

  // Load Cat
  var cat;
  var catAnimationMixer;

  loader.load("models/cat/scene.gltf", function (gltf) {
    cat = gltf.scene;

    // Assuming there is an animation associated with the default scene
    if (gltf.animations && gltf.animations.length > 0) {
      catAnimationMixer = new THREE.AnimationMixer(cat);
      var catAnimationAction = catAnimationMixer.clipAction(gltf.animations[0]);
      catAnimationAction.play();
    }

    cat.position.set(1, 0.01, -1.3);
    cat.scale.set(0.01325, 0.01325, 0.01325);

    scene.add(cat);

    // Add GUI control for cat animation toggle
    var catFolder = gui.addFolder("Cat Animation");
    catFolder.add(controls, "catAnimation").name("Cat Animation");
  });

  // Load the bed room carpet texture
  var bedRoomCarpetTexture = textureLoader.load(
    "models/bed-room-carpet/bed-room-carpet-texture.jpg"
  );

  // Create a material with the loaded texture - painting
  var bedRoomCarpetMaterial = new THREE.MeshStandardMaterial({
    emissive: 0x141a35,
    side: THREE.DoubleSide,
    map: bedRoomCarpetTexture, // Apply the texture to the material
  });

  // Create a carpet
  var bedRoomCarpetGeometry = new THREE.PlaneGeometry(1.75, 1.5, 1, 1);
  var bedRoomCarpet = new THREE.Mesh(
    bedRoomCarpetGeometry,
    bedRoomCarpetMaterial
  );

  // Position the carpet
  bedRoomCarpet.position.set(0, 0.01, -1.2);

  // Rotate the carpet
  bedRoomCarpet.rotation.x = -Math.PI / 2;

  scene.add(bedRoomCarpet);

  // Load the texture
  var paintingTexture = textureLoader.load(
    "models/painting-texture/painting-texture.jpg"
  );

  // Create a material with the loaded texture
  var paintingMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: paintingTexture,
  });

  // Create a  wall painting
  var paintingGeometry = new THREE.PlaneGeometry(0.7, 0.7, 1, 1);
  var painting = new THREE.Mesh(paintingGeometry, paintingMaterial);

  // Position the painting
  painting.position.set(0, 1, -0.25);

  scene.add(painting);

  // Load the window texture
  var windowTexture = textureLoader.load(
    "models/window/window-frame-texture.jpg"
  );

  // Create a material with the loaded texture
  var windowMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: windowTexture,
  });

  // Create a window mesh
  var windowGeometry = new THREE.PlaneGeometry(0.7, 0.7, 1, 1);
  var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

  // Rotate the window
  windowMesh.rotation.set(0, Math.PI / 2, 0);

  // Position the window
  windowMesh.position.set(-1.475, 0.8, -1.3);

  // Add the window to the scene
  scene.add(windowMesh);

  /**
   * Floor Fan
   */

  // Fan blades
  var bladeGeometry = new THREE.BoxGeometry(0.05, 0.01, 0.28);
  var bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  // Create three blades
  var blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
  var blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
  var blade3 = new THREE.Mesh(bladeGeometry, bladeMaterial);
  var blade4 = new THREE.Mesh(bladeGeometry, bladeMaterial);

  // Position the blades in a circular pattern
  blade1.position.set(0, 0, 0.04);
  blade2.position.set(0, 0, -0.05);
  blade3.position.set(0.05, 0, 0);
  blade4.position.set(-0.05, 0, 0);

  blade3.rotation.set(0, Math.PI / 2, 0);
  blade4.rotation.set(0, Math.PI / 2, 0);

  // Fan body
  var bodyGeometry = new THREE.CylinderGeometry(0.1, 0, 0.05, 26);
  var bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(0, 0, 0);

  // Circular guard
  var guardGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.01, 32);
  var guardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  var guard = new THREE.Mesh(guardGeometry, guardMaterial);
  guard.position.set(0, 0, 0);

  // Stander
  var standerGeometry = new THREE.CylinderGeometry(0, 0.035, 0.75, 25);
  var standerMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.7,
  });
  var stander = new THREE.Mesh(standerGeometry, standerMaterial);
  stander.position.set(0.7, 0.3, -1.91);

  scene.add(stander);

  // Combine blades, guard, and body into a group
  var fanGroup = new THREE.Group();
  fanGroup.add(blade1, blade2, blade3, blade4, guard, body);

  // Position the fan group
  fanGroup.position.set(0.7, 0.65, -1.91);

  // Rotate the fan group to cool downwards
  fanGroup.rotation.set(Math.PI / 2.4, 0, 0);

  // Add the fan group to the scene
  scene.add(fanGroup);

  // Function to update fan animation
  function updateFanAnimation() {
    var range = 0.18;
    if (fanControl.fanAnimation) {
      // Continuous rotation around the y-axis
      var continuousRotationSpeed = 0.065;
      fanGroup.rotation.y += continuousRotationSpeed;

      // Change z direction upon reaching the range
      if (fanGroup.rotation.z < range && fanGroup.rotation.z > -range) {
        fanGroup.rotation.z += 0.03;
      } else {
        fanGroup.rotation.z -= 0.02;
      }
    }
  }

  // Listen for changes in the fan animation toggle
  fanAnimationToggle.onChange(function (value) {
    // Reset fan rotation when animation is stopped
    if (!value) {
      fanGroup.rotation.y = 0;
      fanGroup.rotation.z = 0;
    }
  });

  function updateCamera() {
    // Check the state of the camera view and monitor view toggles
    if (cameraControl.monitorView) {
      // Change the camera position to view the monitor in a first-person view
      camera.position.set(0.5, 0.6, 2.9);
      camera.lookAt(monitor.position);
    } else if (cameraControl.viewOtherSide) {
      camera.position.set(4, 3, -3);
      camera.lookAt(monitor.position);
    } else {
      // Reset the camera position to the original
      camera.position.set(4, 3, 3);
      camera.lookAt(scene.position);
    }
  }

  // Listen for changes in the camera view toggle
  cameraToggle.onChange(function (value) {
    updateCamera();
  });

  // Listen for changes in the monitor view toggle
  monitorViewToggle.onChange(function (value) {
    updateCamera();
  });

  light();

  function light() {
    var spotlight = new THREE.SpotLight(0xf5fc5a);
    spotlight.position.set(0, 0, 1.5);
    spotlight.castShadow = true;
    spotlight.intensity = 0.4;
    scene.add(spotlight);

    var dirlight = new THREE.DirectionalLight(0xfdd8ff);
    dirlight.position.set(-0.96, 3, -0.75);
    dirlight.intensity = 0.35;
    scene.add(dirlight);

    var ambi = new THREE.AmbientLight(0x0e1642);
    scene.add(ambi);

    var pointlight = new THREE.PointLight();
    pointlight.position.set(0.1, 0.72, 0.71);
    pointlight.intensity = 0.2;
    scene.add(pointlight);

    // PointLight coming from the lamp
    var lampLight = new THREE.PointLight(0xffffff, 0.5, 5);
    lampLight.position.set(-0.8, 0.5, 1.5);
    scene.add(lampLight);

    // Set initial visibility based on GUI control
    lampLight.visible = lampLightControl.lampLightOn;

    // Lamp Light Control
    lampLightCheckbox.onChange(function (value) {
      lampLight.visible = value;
    });

    // Bedroom Light
    var bedroomLight = new THREE.PointLight(0xffffff, 0.5, 3.7);
    bedroomLight.position.set(0, 0.5, -1.5);

    var bedroomLightControl = {
      bedroomLightOn: false,
      bedroomLightIntensity: 0.5,
    };

    var bedroomLightFolder = gui.addFolder("Bedroom Light");
    bedroomLightFolder
      .add(bedroomLightControl, "bedroomLightOn")
      .name("Switch")
      .onChange(function (value) {
        if (value) {
          scene.add(bedroomLight);
        } else {
          scene.remove(bedroomLight);
        }
      });
    bedroomLightFolder
      .add(bedroomLightControl, "bedroomLightIntensity", 0, 1)
      .name("Light Intensity")
      .onChange(function (value) {
        bedroomLight.intensity = value;
      });
  }

  // Update the fish position and handle collisions
  function updateFishAnimation() {
    if (fishAnimationControl.startAnimation && fish) {
      // Adjust the speed and range of motion as needed
      var range = 0.032;
      var units = 0.001;
      var zUnits = 0.00076;

      // Initialize direction if not defined
      if (typeof fish.directionX === "undefined") {
        fish.directionX = 1;
      }

      if (typeof fish.directionZ === "undefined") {
        fish.directionZ = 1;
      }

      // Calculate the new position based on the direction
      var newX = fish.position.x + units * fish.directionX;
      var newZ = fish.position.z + zUnits * fish.directionZ;

      // Check if within the range for X-axis
      if (newX < range && newX > -range) {
        fish.position.x = newX;
      } else {
        // If outside the range, change direction for X-axis
        fish.directionX *= -1;
      }

      // Check if within the range for Z-axis
      if (newZ < range && newZ > -range) {
        fish.position.z = newZ;
      } else {
        // If outside the range, change direction for Z-axis
        fish.directionZ *= -1;
      }

      // Rotate the fish to face the current direction
      fish.rotation.y = Math.atan2(fish.directionX, fish.directionZ);
    } else {
      // Reset fish position when animation is stopped
      if (fish) {
        fish.position.x = 0;
      }
    }
  }

  // Initialize an array to store snow particle objects
  var snow = [];
  // Set the total number of snow particles
  var totalParticles = 50;

  // Loop to create and initialize each snow particle
  for (var i = 0; i < totalParticles; i++) {
    // Create a new Snow particle object
    var particle = new Snow();
    // Initialize the particle's properties
    particle.init();
    // Create and add the particle to the scene
    particle.modelize();
    snow.push(particle); // Add the particle to the array
  }

  // Constructor function for the Snow particle
  function Snow() {
    // Define properties of the snow particle
    this.position = new THREE.Vector3(); // 3D position vector
    this.vel = new THREE.Vector3(
      -1 * (0.0005 + Math.random() * 0.001), // X velocity with random variation
      -1 * (0.005 + Math.random() * 0.01), // Y velocity with random variation
      -0.1 * (0.005 + Math.random() * 0.01) // Z velocity with random variation
    );

    // Initialize function for the snow particle
    this.init = function () {
      // Set initial position of the particle
      this.position.x = Math.random() * 3 - 1.5;
      this.position.y = 2.6;
      this.position.z = Math.random() * 4 - 2;
    };

    // Function to create the visual representation (mesh) of the snow particle
    this.modelize = function () {
      // Define possible colors for the particle
      var confettiColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
      // Choose a random color for the particle
      var color =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];

      // Create geometry for the particle (cube)
      var confettiGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
      // Create material with the selected color
      var confettiMaterial = new THREE.MeshPhongMaterial({ color: color });

      // Create a mesh using the geometry and material
      this.mesh = new THREE.Mesh(confettiGeometry, confettiMaterial);
      // Set the mesh's position to match the particle's position
      this.mesh.position.copy(this.position);
      // Enable casting and receiving shadows for the mesh
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;

      // Add the mesh to the scene
      scene.add(this.mesh);
    };

    // Function to update the position of the snow particle over time
    this.update = function () {
      // Ensure the particle stays within a certain range on the y-axis
      if (this.position.y < 0) this.position.y = 2.6;
      // Bounce off the walls on the x-axis
      if (this.position.x < 0 || this.position.x > 2.85) this.vel.x *= -1;
      // Bounce off the walls on the z-axis
      if (this.position.z < -2.47 || this.position.z > -0.47) this.vel.z *= -1;

      // Update the particle's position based on its velocity
      this.position.add(this.vel);
      // Update the mesh's position to match the particle's position
      this.mesh.position.copy(this.position);
    };
  }

  function update() {
    // Check if the confetti effect is enabled
    if (confettiControl.confetiiEffect) {
      // Loop through all snow particles and update their positions
      for (var i = 0; i < totalParticles; i++) {
        snow[i].update();
      }
    }

    // Update camera view based on GUI control
    updateCamera();

    // Update door state based on GUI control
    if (doorControl.isOpen) {
      // Code to open the door using Tween.js
      var targetRotation = initialDoorRotation - Math.PI / 2; // Adjust the angle as needed

      new TWEEN.Tween(pivotGroup.rotation)
        .to({ y: targetRotation }, 300) // Adjust the duration (300 milliseconds for faster opening)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    } else {
      // Code to close the door using Tween.js
      new TWEEN.Tween(pivotGroup.rotation)
        .to({ y: initialDoorRotation }, 100) // Adjust the duration (100 milliseconds for faster closing)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }

    // Update fish animation
    updateFishAnimation();

    // Update Fan animation
    updateFanAnimation();

    requestAnimationFrame(update);
  }

  // Update fan animation
  updateFanAnimation();

  // Listen for changes in the fish animation toggle
  fishAnimationToggle.onChange(function (value) {
    // Reset fish position when animation is stopped
    if (!value && fish) {
      fish.position.x = 0;
    }
  });

  function animate() {
    // As per the offical three.js site docs
    videoTexture.needsUpdate = true;

    // Update the cat animation mixer only if the animation is enabled
    if (catAnimationMixer && controls.catAnimation) {
      catAnimationMixer.update(0.016);
    }

    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
  }

  /**
   * Animte, Render, Update call
   */

  animate();

  document.getElementById("webGL-container").appendChild(renderer.domElement);
  renderer.render(scene, camera);

  update();
});
