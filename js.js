var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
    engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
    engine.adaptToDeviceRatio = true;
  });
};
var json;
var engine = null;
var scene = null;
var sceneToRender = null;

let inOut = document.getElementById("inOut");
let buy = document.getElementById("buy");
let buttonBox = document.getElementById("buttonBox");
let textBlock = document.getElementById("textBlock");
let textBlockTitle = document.getElementById("textBlockTitle");
let textBlockText = document.getElementById("textBlockText");
let isAwailable = document.getElementById("isAwailable");
let buttonM = document.getElementById("buttonM");
let pointerText = document.getElementById("pointerText");

var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
async function fetchData() {
  await fetch("awailability.json")
    .then((response) => response.json())
    .then((data) => (json = data.floors));
  // console.log(json);
}

var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  var chosen;
  var chosenRoom;
  scene.clearColor = new BABYLON.Color3.FromHexString("#6076cc");
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  var hl = new BABYLON.HighlightLayer("hl1", scene);

  const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "003.env",
    scene
  );
  hdrTexture.rotationY = -0.2;

  scene.environmentIntensity = 1;

  scene.environmentTexture = hdrTexture;

  var alpha = 0;
  scene.registerBeforeRender(() => {
    alpha += 0.06;

    hl.blurHorizontalSize = 0.3 + Math.cos(alpha) * 0.6 + 0.6;
    hl.blurVerticalSize = 0.3 + Math.sin(alpha / 3) * 0.6 + 0.6;
  });

  var camera = new BABYLON.ArcRotateCamera(
    "camera",
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(65),
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  let resetMat = new BABYLON.StandardMaterial("resetMat", scene);
  resetMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  resetMat.albedoColor = new BABYLON.Color3(1, 1, 1);
  resetMat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  camera.attachControl(canvas, true);
  camera.lowerBetaLimit = Math.PI / 8;
  camera.upperBetaLimit = Math.PI / 2;
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 40;
  camera.position = new BABYLON.Vector3(
    -1.0258005680719759924,
    26.991616416113352,
    -29.40865685519843
  );

  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  let actionManager = new BABYLON.ActionManager(scene);
  let interior = false;

  function inOutf() {
    interior = !interior;
    // console.log(interior);

    scene.stopAnimation(camera);

    createScene();
  }

  inOut.addEventListener("click", function () {
    inOutf();
  });

  buy.addEventListener("click", function () {
    window.open("http://google.com");
  });

  let mat = new BABYLON.StandardMaterial("mat", scene);
  mat.diffuseColor = new BABYLON.Color3.FromHexString("#696969");

  function animateCameraTarget(x, y, z) {
    let xHalfWay;
    let yHalfWay;
    let zHalfWay;
    if (camera.target.clone().x < x) {
      xHalfWay = (x - camera.target.clone().x) / 2 + camera.target.clone().x;
    } else {
      xHalfWay = (camera.target.clone().x - x) / 2 + x;
    }
    if (camera.target.clone().y < y) {
      yHalfWay = (y - camera.target.clone().y) / 2 + camera.target.clone().y;
    } else {
      yHalfWay = (camera.target.clone().y - y) / 2 + y;
    }
    if (camera.target.clone().z < z) {
      zHalfWay = (z - camera.target.clone().z) / 2 + camera.target.clone().z;
    } else {
      zHalfWay = (camera.target.clone().z - z) / 2 + z;
    }
    var animationCameraTarget = new BABYLON.Animation(
      "lookcam",
      "target",
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFrames = [];
    keyFrames.push({
      frame: 0,
      value: camera.target.clone(),
    });
    keyFrames.push({
      frame: 60,
      value: new BABYLON.Vector3(x, y, z),
    });
    animationCameraTarget.setKeys(keyFrames);
    const easingFun2 = new BABYLON.CubicEase();
    easingFun2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animationCameraTarget.setEasingFunction(easingFun2);
    camera.animations.push(animationCameraTarget);
    scene.beginDirectAnimation(camera, [animationCameraTarget], 0, 60, false);
  }

  function animateCameraStart() {
    var animationCameraStart = new BABYLON.Animation(
      "startcam",
      "position",
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFramesS = [];
    keyFramesS.push({
      frame: 0,
      value: camera.position.clone(),
    });
    keyFramesS.push({
      frame: 60,
      value: new BABYLON.Vector3(
        -0.7394373932364317,
        0.38806262815679643,
        -19.951957335162042
      ),
    });
    animationCameraStart.setKeys(keyFramesS);
    const easingFun3 = new BABYLON.QuinticEase();
    easingFun3.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animationCameraStart.setEasingFunction(easingFun3);

    camera.animations.push(animationCameraStart);

    scene.beginDirectAnimation(camera, [animationCameraStart], 0, 60, false);
  }

  function animateCameraPosition(x, y, z) {
    var animationCameraPosition = new BABYLON.Animation(
      "camPos",
      "position",
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFramesP = [];
    keyFramesP.push({
      frame: 0,
      value: camera.position.clone(),
    });
    keyFramesP.push({
      frame: 60,
      value: new BABYLON.Vector3(x - 10, y, z - 10),
    });
    animationCameraPosition.setKeys(keyFramesP);
    const easingFun2 = new BABYLON.CubicEase();
    easingFun2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animationCameraPosition.setEasingFunction(easingFun2);
    camera.animations.push(animationCameraPosition);
    scene.beginDirectAnimation(camera, [animationCameraPosition], 0, 60, false);
  }

  function animateFloorPosition(mesh, positionE) {
    if (mesh) {
      var animationFloorPosition = new BABYLON.Animation(
        "floorPos",
        "position",
        60,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      const keyFramesPF = [];
      keyFramesPF.push({
        frame: 0,
        value: mesh.position.clone(),
      });
      keyFramesPF.push({
        frame: 60,
        value: new BABYLON.Vector3(0, positionE, 0),
      });
      animationFloorPosition.setKeys(keyFramesPF);
      const easingFun2 = new BABYLON.CubicEase();
      easingFun2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
      animationFloorPosition.setEasingFunction(easingFun2);

      mesh.animations.push(animationFloorPosition);
      scene.beginDirectAnimation(mesh, [animationFloorPosition], 0, 60, false);
    }
  }

  window.addEventListener("load", function () {
    fetchData();
    createScene();
  });

  let city;
  let office1;
  let buildingId;

  let roomId;

  let loaded = false;

  BABYLON.SceneLoader.ImportMeshAsync("", "stan.glb", null, scene, (evt) => {
    let loadedPercent = 0;
    if (evt.lengthComputable) {
      loadedPercent = (evt.loaded * 100) / evt.total;
      loadedPercent = loadedPercent.toFixed();
    } else {
      loadedPercent = (evt.loaded * 100) / 11494972;
      loadedPercent = loadedPercent.toFixed();
    }
    document.getElementById(
      "loadingPercentages"
    ).innerHTML = `${loadedPercent}%`;
  }).then((result) => {
    setTimeout(() => {
      interval = null;
      document.getElementById("customLoadingScreenDiv").style.display = "none";
    }, 1000);

    result.meshes[7].visibility = 0.2;

    let shadowTexture = new BABYLON.Texture("Shadows.png", scene);
    shadowTexture._coordinatesIndex = 1;

    shadowTexture.uOffset = 0;
    shadowTexture.vOffset = 0;
    shadowTexture.uScale = 1;
    shadowTexture.vScale = 1;

    shadowTexture.uAng = Math.PI;
    for (let i = 3; i < result.meshes.length; i++) {
      result.meshes[i].material.lightmapTexture = shadowTexture;
      result.meshes[i].material._useLightmapAsShadowmap = true;
    }
    // result.meshes.map((mes) => {
    //     mes.material.lightmapTexture = shadowTexture;
    //     mes.material._useLightmapAsShadowmap = true;
    // });
    // result.meshes[34].material.lightmapTexture = shadowTexture;
    // result.meshes[34].material._useLightmapAsShadowmap = true;
    // result.meshes[16].material.lightmapTexture = shadowTexture;
    // result.meshes[16].material._useLightmapAsShadowmap = true;
    // result.meshes[3].material.lightmapTexture = shadowTexture;
    // result.meshes[3].material._useLightmapAsShadowmap = true;
    // result.meshes[27].material.lightmapTexture = shadowTexture;
    // result.meshes[27].material._useLightmapAsShadowmap = true;
    // result.meshes[28].material.lightmapTexture = shadowTexture;
    // result.meshes[28].material._useLightmapAsShadowmap = true;
    // result.meshes[29].material.lightmapTexture = shadowTexture;
    // result.meshes[29].material._useLightmapAsShadowmap = true;
    // result.meshes[35].material.lightmapTexture = shadowTexture;
    // result.meshes[35].material._useLightmapAsShadowmap = true;
    // result.meshes[33].material.lightmapTexture = shadowTexture;
    // result.meshes[33].material._useLightmapAsShadowmap = true;
    // result.meshes[44].material.lightmapTexture = shadowTexture;
    // result.meshes[44].material._useLightmapAsShadowmap = true;
    // result.meshes[8].material.lightmapTexture = shadowTexture;
    // result.meshes[8].material._useLightmapAsShadowmap = true;

    result.meshes[0].rotation = new BABYLON.Vector3(0, 2 * Math.PI, 0);
    result.meshes[0].position.x = -2.5;
    result.meshes[0].position.z = 5;
    office1 = result.meshes[0];
    result.meshes[0].scaling = new BABYLON.Vector3(1.3, 1.3, -1.3);

    result.meshes[0].position.y = 19.5;
    loaded = true;
  });

  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    "Zgrada podeljena na spratove-Smanjeno2.glb",
    scene,
    (meshes) => {
      // console.log(meshes);

      meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
      meshes[0].position.y = -3;
      meshes[0].addRotation(0, Math.PI, 0);
      city = meshes[0];

      meshes[70].visibility = 0;

      setTimeout(() => {
        if (!buildingChosen) {
          for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 10; j++) {
              scene.getMeshByID(
                i + ". " + "sprat_primitive" + j
              ).actionManager = actionManager;
              if (!buildingChosen) {
                scene
                  .getMeshByID(i + ". " + "sprat_primitive" + j)
                  .actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                      BABYLON.ActionManager.OnPointerOverTrigger,
                      function (ev) {
                        if (!buildingChosen) {
                          // console.log("aa");
                          let meshId = scene.meshUnderPointer.id;
                          let buildingIdEnd = meshId.indexOf(".");
                          let meshArray = meshId.split("");
                          let buildingIdArray = meshArray.slice(
                            0,
                            buildingIdEnd
                          );
                          scene.hoverCursor = "pointer";
                          // console.log("1");
                          //   for (let p = 0; p < 10; p++) {
                          hl.addMesh(
                            scene.getMeshByID(
                              buildingIdArray + ". " + "sprat_primitive" + j
                            ),
                            BABYLON.Color3.FromHexString("#F5F5F5")
                          );
                          //   }
                        }
                      }
                    )
                  );

                scene
                  .getMeshByID(i + ". " + "sprat_primitive" + j)
                  .actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                      BABYLON.ActionManager.OnPointerOutTrigger,
                      function (ev) {
                        if (!buildingChosen) {
                          //   for (let k = 0; k < 10; k++) {
                          hl.removeMesh(
                            scene.getMeshByID(i + ". " + "sprat_primitive" + j),
                            BABYLON.Color3.FromHexString("#F5F5F5")
                          );
                          //   }
                        }
                      }
                    )
                  );
              }
            }
          }
        }
      }, 1000);
    }
  );

  let itHit = false;
  let newTime;
  let oldTime = 0;
  let d;
  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.01 }, scene);

  let lastBuildingId;
  let buildingChosen = false;

  function resetFloors() {
    buildingChosen = false;
    box.position.y = 1000;
    box.position.z = -1;
    box.position.x = -0.1;

    for (let i = 1; i < 5; i++) {
      scene.getMeshByID("room" + i).material = resetMat;
    }

    if (lastBuildingId != null) {
      for (let i = 0; i < 10; i++) {
        hl.removeMesh(
          scene.getMeshByID(lastBuildingId + ". " + "sprat_primitive" + i)
        );
      }
    }

    for (let i = 1; i < 5; i++) {
      scene.getMeshByID("room" + i).material = resetMat;
    }
    for (let i = 1; i < 7; i++) {
      for (let j = 0; j < 11; j++) {
        if (i < 6) {
          animateFloorPosition(
            scene.getMeshByID(i + ". " + "sprat_primitive" + j),
            10 * i
          );
        } else {
          if (j < 10) {
            animateFloorPosition(
              scene.getMeshByID("Krov" + "_primitive" + j),
              10 * i
            );
          }
        }
      }
    }
  }

  canvas.addEventListener("click", function () {
    // console.log("proslo");

    d = new Date();
    newTime = d.getTime();
    if (!interior && newTime - oldTime < 300) {
      textBlock.style.display = "none";
      inOut.style.display = "none";
      buttonBox.style.display = "none";
      animateCameraTarget(0, 0, 0);
      if (camera.position.z > 0) {
        animateCameraStart();
      } else {
        animateCameraStart();
      }
      resetFloors();
    }
    oldTime = newTime;
  });
  let c = 0;
  var boxr11 = BABYLON.MeshBuilder.CreateBox(
    "boxr1",
    { size: 2.3, width: 4.8, height: 1 },
    scene
  );

  boxr11.position.y = 100;

  var boxr21 = BABYLON.MeshBuilder.CreateBox(
    "boxr2",
    { size: 2.5, width: 5.6 },
    scene
  );
  boxr21.position = new BABYLON.Vector3(0.8, 100, 2);

  let boxr11CSG = BABYLON.CSG.FromMesh(boxr11);
  let boxr21CSG = BABYLON.CSG.FromMesh(boxr21);

  let booleanCSG1 = boxr11CSG.subtract(boxr21CSG);

  let room1 = booleanCSG1.toMesh("room1", null, scene);
  boxr11.visibility = false;
  boxr21.visibility = false;
  var boxr1 = BABYLON.MeshBuilder.CreateBox(
    "boxr1",
    { size: 2.8, width: 4.8, height: 1 },
    scene
  );

  boxr1.position.y = 100;

  var boxr2 = BABYLON.MeshBuilder.CreateBox("boxr2", { size: 2.5 }, scene);
  boxr2.position = new BABYLON.Vector3(0.8, 100, -1.8);
  var boxr3 = BABYLON.MeshBuilder.CreateBox("boxr3", { size: 2.5 }, scene);
  boxr3.position = new BABYLON.Vector3(2.3, 100, -1);

  let boxr1CSG = BABYLON.CSG.FromMesh(boxr1);
  let boxr2CSG = BABYLON.CSG.FromMesh(boxr2);
  let boxr3CSG = BABYLON.CSG.FromMesh(boxr3);

  let booleanCSG = boxr1CSG.subtract(boxr2CSG).subtract(boxr3CSG);

  let room2 = booleanCSG.toMesh("room2", null, scene);

  boxr1.visibility = false;
  boxr2.visibility = false;
  boxr3.visibility = false;

  var boxr13 = BABYLON.MeshBuilder.CreateBox(
    "boxr13",
    { size: 2.8, width: 4.6, height: 1 },
    scene
  );

  boxr13.position.y = 100;

  var boxr23 = BABYLON.MeshBuilder.CreateBox("boxr23", { size: 2.5 }, scene);
  boxr23.position = new BABYLON.Vector3(1.1, 100, -2.2);
  var boxr33 = BABYLON.MeshBuilder.CreateBox("boxr23", { size: 2.5 }, scene);
  boxr33.position = new BABYLON.Vector3(-2.1, 100, -2.2);

  let boxr13CSG = BABYLON.CSG.FromMesh(boxr13);
  let boxr23CSG = BABYLON.CSG.FromMesh(boxr23);
  let boxr33CSG = BABYLON.CSG.FromMesh(boxr33);

  let booleanCSG3 = boxr13CSG.subtract(boxr23CSG).subtract(boxr33CSG);

  let room3 = booleanCSG3.toMesh("room3", null, scene);
  boxr13.visibility = false;
  boxr23.visibility = false;
  boxr33.visibility = false;

  var boxr14 = BABYLON.MeshBuilder.CreateBox(
    "boxr14",
    { size: 2.3, width: 4.6, height: 1 },
    scene
  );

  boxr14.position.y = 100;

  var boxr24 = BABYLON.MeshBuilder.CreateBox(
    "boxr23",
    { size: 2.5, width: 3 },
    scene
  );
  boxr24.position = new BABYLON.Vector3(-0.8, 100, 2);

  let boxr14CSG = BABYLON.CSG.FromMesh(boxr14);
  let boxr24CSG = BABYLON.CSG.FromMesh(boxr24);

  let booleanCSG4 = boxr14CSG.subtract(boxr24CSG);

  let room4 = booleanCSG4.toMesh("room4", null, scene);
  boxr14.visibility = false;
  boxr24.visibility = false;

  room1.position.z = 1.9;
  room1.position.x = 2.5;
  room3.position.z = -0.8;
  room3.position.x = -2.4;
  room2.position.z = -0.8;
  room2.position.x = 2.5;
  room4.position.z = 1.9;
  room4.position.x = -2.4;

  box.position.y = 1000;
  room1.parent = box;
  room2.parent = box;
  room3.parent = box;
  room4.parent = box;
  box.visibility = 0;

  room1.actionManager = new BABYLON.ActionManager(scene);

  room1.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        scene.hoverCursor = "pointer";
        room1.material = mat;
        textBlockTitle.textContent = "Floor " + buildingId + " Room " + 1;
        chosenRoom = 1;
      }
    )
  );

  //ON MOUSE EXIT
  room1.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (ev) {
        if (!interior) {
          room1.material = resetMat;
          textBlockTitle.textContent = "Floor " + buildingId;
          chosenRoom = 0;
        }
      }
    )
  );

  room2.actionManager = new BABYLON.ActionManager(scene);

  room2.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        scene.hoverCursor = "pointer";
        room2.material = mat;
        textBlockTitle.textContent = "Floor " + buildingId + " Room " + 2;
        chosenRoom = 2;
      }
    )
  );

  //ON MOUSE EXIT
  room2.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (ev) {
        if (!interior) {
          room2.material = resetMat;
          textBlockTitle.textContent = "Floor " + buildingId;
          chosenRoom = 0;
        }
      }
    )
  );

  room3.actionManager = new BABYLON.ActionManager(scene);

  room3.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        scene.hoverCursor = "pointer";
        room3.material = mat;
        textBlockTitle.textContent = "Floor " + buildingId + " Room " + 3;
        chosenRoom = 3;
      }
    )
  );

  //ON MOUSE EXIT
  room3.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (ev) {
        if (!interior) {
          room3.material = resetMat;
          textBlockTitle.textContent = "Floor " + buildingId;
          chosenRoom = 0;
        }
      }
    )
  );

  room4.actionManager = new BABYLON.ActionManager(scene);

  room4.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        scene.hoverCursor = "pointer";
        room4.material = mat;
        textBlockTitle.textContent = "Floor " + buildingId + " Room " + 4;
        chosenRoom = 4;
      }
    )
  );

  //ON MOUSE EXIT
  room4.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (ev) {
        if (!interior) {
          room4.material = resetMat;
          textBlockTitle.textContent = "Floor " + buildingId;
          chosenRoom = 0;
        }
      }
    )
  );

  function createScene() {
    if (interior) {
      // console.log("lako");
      box.position.y = 1000;
      inOut.textContent = "Go Back";
      if (json[chosen - 1][chosenRoom - 1]) {
        isAwailable.textContent = "Awailable";
      } else {
        isAwailable.textContent = "Not Awailable";
      }
      buy.style.display = "flex";

      city.position.y = 1000;
      office1.position.y = 0;

      textBlockTitle.textContent = "Room interior";
      textBlockText.textContent =
        " Indulge in the pinnacle of elegance and comfort in our meticulously crafted apartments. With upscale finishes, modern amenities, and tailored layouts, each unit offers an exquisite living experience. From cozy studios to spacious residences, find your perfect haven in our sought-after apartments. Elevate your lifestyle today.";

      camera.position = new BABYLON.Vector3(0, 20, -20);
      animateCameraTarget(0, office1.position.y, 0);
      textBlock.style.display = "flex";
    } else {
      // console.log("kako");
      buy.style.display = "none";
      inOut.style.display = "none";
      buttonBox.style.display = "none";
      isAwailable.textContent = "";
      textBlock.style.display = "none";
      light.intensity = 0.7;

      itHit = false;

      scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERPICK:
            if (pointerInfo.pickInfo.hit) {
              itHit = true;
              pointerDown(pointerInfo.pickInfo.pickedMesh);

              setTimeout(() => {
                if (pointerInfo.pickInfo.pickedMesh.id.indexOf("sprat") != -1) {
                  animateCameraTarget(
                    pointerInfo.pickInfo.pickedMesh._absolutePosition.x,
                    pointerInfo.pickInfo.pickedMesh._absolutePosition.y,
                    0
                  );
                  if (camera.position.z < 0) {
                    if (camera.position.x < 5) {
                      animateCameraPosition(
                        pointerInfo.pickInfo.pickedPoint.x + 5,
                        pointerInfo.pickInfo.pickedPoint.y + 7,
                        pointerInfo.pickInfo.pickedPoint.z
                      );
                    } else {
                      animateCameraPosition(
                        pointerInfo.pickInfo.pickedPoint.x + 20,
                        pointerInfo.pickInfo.pickedPoint.y + 7,
                        pointerInfo.pickInfo.pickedPoint.z
                      );
                    }
                  } else {
                    if (camera.position.x < 5) {
                      animateCameraPosition(
                        pointerInfo.pickInfo.pickedPoint.x + 5,
                        pointerInfo.pickInfo.pickedPoint.y + 7,
                        pointerInfo.pickInfo.pickedPoint.z + 20
                      );
                    } else {
                      animateCameraPosition(
                        pointerInfo.pickInfo.pickedPoint.x + 20,
                        pointerInfo.pickInfo.pickedPoint.y + 7,
                        pointerInfo.pickInfo.pickedPoint.z + 20
                      );
                    }
                  }
                }
              }, 500);
            } else {
              itHit = false;
            }

          case BABYLON.PointerEventTypes.POINTERDOWN:
            if (pointerInfo.event.inputIndex == 4 && !interior) {
              resetFloors();
              textBlock.style.display = "none";
              inOut.style.display = "none";
              buttonBox.style.display = "none";
              animateCameraTarget(0, 0, 0);
              if (camera.position.z > 0) {
                animateCameraStart();
              } else {
                animateCameraStart();
              }
            }

          case BABYLON.PointerEventTypes.POINTERWHEEL:
            if (pointerInfo.type == 8) {
              scene.stopAnimation(camera);
            }
            break;
        }
      });

      const pointerDown = (mesh) => {
        // console.log(mesh);
        let meshId = mesh.id;
        let buildingIdEnd = meshId.indexOf(".");
        let meshArray = meshId.split("");
        let buildingIdArray = meshArray.slice(0, buildingIdEnd);

        if (meshId.indexOf("room") != -1) {
          roomId = mesh.id.split("").splice(4, 1);
          //   textBlockTitle.textContent =
          //     "Floor " + buildingId + " Room " + roomId;
          chosenRoom = roomId;

          inOutf();
          buttonBox.style.display = "flex";
          inOut.style.display = "flex";
          //   textBlockTitle.textContent = "Floor " + buildingId + "Room" + roomId;
        }

        if (meshId.indexOf("sprat") != -1) {
          pointerText.style.display = "none";
          buildingId = buildingIdArray.join("");
          textBlock.style.display = "flex";
          inOut.style.display = "none";

          textBlockTitle.textContent = "Floor " + buildingId;
          textBlockText.textContent =
            "Experience the vertical allure of our impressive multi-floor building. With a range of floors to choose from, each offering unique perspectives and amenities, our building is designed to cater to your diverse needs. Explore the possibilities and find the perfect level to call home or establish your business. Discover a world of possibilities within our remarkable multi-floor building.";

          chosen = buildingId;
        } else if (
          meshId.indexOf("Circle") != -1 ||
          meshId.indexOf("Priyemlje") != -1 ||
          meshId.indexOf("Krov") != -1
        ) {
          textBlock.style.display = "none";
          inOut.style.display = "none";
          animateCameraTarget(0, 0, 0);

          if (camera.position.z > 0) {
            animateCameraStart();
          } else {
            animateCameraStart();
          }
          resetFloors();
        }
        if (!interior) {
          if (meshId.indexOf("room") != -1) {
            inOut.style.display = "flex";
            buttonBox.style.display = "flex";

            for (let i = 1; i < 5; i++) {
              scene.getMeshByID("room" + i).material = resetMat;
            }
          } else {
            for (let i = 1; i < 5; i++) {
              scene.getMeshByID("room" + i).material = resetMat;
            }
          }
        }

        if (!interior && meshId != "Circle" && meshId.indexOf("sprat") != -1) {
          if (lastBuildingId != null) {
            for (let i = 0; i < 10; i++) {
              hl.removeMesh(
                scene.getMeshByID(lastBuildingId + ". " + "sprat_primitive" + i)
              );
            }
          }
          lastBuildingId = buildingId;

          for (let i = 0; i < 10; i++) {
            hl.addMesh(
              scene.getMeshByID(buildingId + ". " + "sprat_primitive" + i),
              new BABYLON.Color3.FromHexString("#F5F5F5")
            );
            buildingChosen = true;
          }

          let increase = 0;
          chosen = parseInt(chosen);

          for (let i = 1; i < 7; i++) {
            if (chosen == i || chosen + 1 == i) {
              increase += 8000;
            }
            increase += 1000;
            for (let j = 0; j < 11; j++) {
              if (i < 6) {
                animateFloorPosition(
                  scene.getMeshByID(i + ". " + "sprat_primitive" + j),
                  increase
                );
              } else {
                if (j < 8) {
                  animateFloorPosition(
                    scene.getMeshByID("Krov_primitive" + j),
                    increase
                  );
                }
              }
            }
          }
        }
        if (meshId.indexOf("room") != -1) {
          scene.getMeshByID(meshId).material = mat;
        } else {
          box.position.y = 1000;

          setTimeout(() => {
            if (chosen == 5) {
              box.position.y =
                scene.getMeshByID(chosen + ". " + "sprat_primitive" + 0)
                  ._absolutePosition.y +
                2.2 -
                100;
            } else if (chosen != undefined) {
              box.position.y =
                scene.getMeshByID(chosen + ". " + "sprat_primitive" + 0)
                  ._absolutePosition.y +
                1.2 -
                100;
            }
          }, 700);
        }
      };

      if (loaded) {
        office1.position.y = 1000;

        city.position.y = -3;
      }

      inOut.textContent = "Look inside";
      camera.position = new BABYLON.Vector3(0, 20, -20);

      resetFloors();
      animateCameraTarget(0, 0, 0);

      animateCameraStart();

      c++;
    }
  }

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

window.addEventListener("resize", function () {
  engine.resize();
});
