import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import "./App.css"; 


const ModelUploader = () => {
  const canvasRef = useRef(null);
  const [modelVisible, setModelVisible] = useState(true);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Babylon Scene
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // Light
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Save the scene to the useRef
    sceneRef.current = scene;

    // Render loop
    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });

    // Clean up
    return () => {
      engine.dispose();
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["gltf", "glb", "babylon"].includes(fileExtension)) {
        if (fileExtension === "babylon" || fileExtension === "gltf") {
          BABYLON.SceneLoader.Append("", file, sceneRef.current, function (sceneLoaded) {
            // Callback function once the .babylon or .gltf file is loaded
            // Center and scale the model
            const boundingInfo = sceneLoaded.getBoundingBox();
            const size = boundingInfo.extendSizeWorld.scale(1.5);
            sceneLoaded.meshes.forEach((mesh) => {
              mesh.scaling.scaleInPlace(1 / size);
              mesh.position.y -= boundingInfo.extendSizeWorld.y;
            });
          });
        } else {
          BABYLON.SceneLoader.LoadAssetContainer("", file, sceneRef.current, function (container) {
            container.addAllToScene();
            // Center and scale the model
            const boundingInfo = sceneRef.current.getBoundingBox();
            const size = boundingInfo.extendSizeWorld.scale(1.5);
            sceneRef.current.meshes.forEach((mesh) => {
              mesh.scaling.scaleInPlace(1 / size);
              mesh.position.y -= boundingInfo.extendSizeWorld.y;
            });
          });
        }
      } else {
        alert("Please select a .gltf, .glb, or .babylon file.");
      }
    }
  };

  const handleHide = () => {
    setModelVisible(false);
    sceneRef.current.meshes.forEach((mesh) => {
      mesh.setEnabled(false);
    });
  };

  const handleShow = () => {
    setModelVisible(true);
    sceneRef.current.meshes.forEach((mesh) => {
      mesh.setEnabled(true);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: "#333", color: "#fff", padding: "10px 20px", marginBottom: "10px" ,height:'70px'}}>
        <h2 style={{ margin: 0 }}>3D Model Viewer <i class="fa-brands fa-codepen"></i></h2>
      </nav>

      <div style={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
        {/* Left-side div */}
        <div style={{ width: "300px", backgroundColor: "#f0f0f0", padding: "20px", marginRight: "10px" }}>
          {/* Add content for the left-side div here */}
          <h1> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-circle-info"></i></h1>
          <p>Kindly ensure that your files are in .babylon format to utilize our 3D viewer.</p>
          {/* Choose File button */}
          <div className="mb-3">
            <label className="sa"  >
              
              <input type="file" accept=".gltf, .glb, .babylon" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        {/* Model Viewer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", height: "500px", marginBottom: "10px" }}>
            <canvas ref={canvasRef} style={{ width: "99%", height: "700px" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", position: "absolute", top: "10px", right: "10px" }}>
              <button class="btn btn-outline-light" onClick={handleHide} style={{marginRight:"20px",marginTop:"20px",height:'70px',width:'70px'}} ><h1><i class="fa-solid fa-eye-slash"></i></h1></button>
              <div style={{ marginTop: "5px" }}>
                <button class="btn btn-outline-light" onClick={handleShow} style={{marginTop:"20px",marginRight:'20px',height:'70px',width:'70px'}}><h1><i class="fa-solid fa-eye"></i></h1></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelUploader;
