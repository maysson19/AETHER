
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-science-lab-three',
  imports: [],
  templateUrl: './science-lab-three.html',
  styleUrl: './science-lab-three.scss',
})
export class ScienceLabThree implements AfterViewInit, OnDestroy {

  @ViewChild('canvasHost', { static: true })
  canvasHost!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private animationId = 0;
  private resizeObserver?: ResizeObserver;

  private mouse = new THREE.Vector2();
  private clock = new THREE.Clock();

  private scientist!: THREE.Group;
  private microscope!: THREE.Group;
  private molecules: THREE.Group[] = [];

  private head!: THREE.Group;
private leftArm!: THREE.Group;
private rightArm!: THREE.Group;
private body!: THREE.Mesh;



  ngAfterViewInit(): void {
    this.initScene();
    this.createLighting();
    this.createEnvironment();
    this.createScientist();
    this.createMicroscope();
    this.createMolecules();
    this.setupEvents();
    this.animate();
  }

  private initScene(): void {
    const host = this.canvasHost.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      38,
      host.clientWidth / host.clientHeight,
      0.1,
      100
    );

    this.camera.position.set(0, 1.5, 9);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(host.clientWidth, host.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    host.appendChild(this.renderer.domElement);
  }

  private createLighting(): void {
    this.scene.add(
      new THREE.AmbientLight(0x8aaaff, 2)
    );

    const blueLight = new THREE.PointLight(0x428cff, 45, 15);
    blueLight.position.set(-3, 3, 4);
    this.scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x9b5cff, 35, 15);
    purpleLight.position.set(4, 1, 2);
    this.scene.add(purpleLight);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 2);
    whiteLight.position.set(0, 5, 5);
    this.scene.add(whiteLight);
  }

  private createEnvironment(): void {
    const ring = new THREE.Mesh(
  new THREE.TorusGeometry(2.7, 0.008, 8, 150),
  new THREE.MeshBasicMaterial({
    color: 0x538dff,
    transparent: true,
    opacity: 0.35,
  })
);

ring.rotation.x = 0.4;
ring.position.set(0, 0.15, -0.5);

this.scene.add(ring);

    const starGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i < 450; i++) {
      positions.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5 - 2
      );
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0x9fc7ff,
        size: 0.025,
        transparent: true,
        opacity: 0.8,
      })
    );

    this.scene.add(stars);
  }

 

private createScientist(): void {
  this.scientist = new THREE.Group();

  const coatMaterial = new THREE.MeshStandardMaterial({
    color: 0xdce8ff,
    roughness: 0.65,
  });

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xc98e70,
    roughness: 0.8,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x17233b,
    roughness: 0.9,
  });

  // BODY
  this.body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 1.05, 8, 16),
    coatMaterial
  );

  this.body.position.set(-1.5, -0.75, 0);
  this.scientist.add(this.body);

  // NECK
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.15, 0.25, 20),
    skinMaterial
  );

  neck.position.set(-1.5, -0.05, 0);
  this.scientist.add(neck);

  // HEAD
  this.head = new THREE.Group();
  this.head.position.set(-1.5, 0.35, 0.05);

  const face = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 32),
    skinMaterial
  );

  this.head.add(face);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.39, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.48
    ),
    hairMaterial
  );

  hair.position.y = 0.07;
  this.head.add(hair);

  // EYES
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x17233b,
    roughness: 0.4,
  });

  [-0.12, 0.12].forEach((x) => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      eyeMaterial
    );

    eye.position.set(x, 0.02, 0.345);
    this.head.add(eye);
  });

  this.scientist.add(this.head);

  // LEFT ARM
  this.leftArm = new THREE.Group();
  this.leftArm.position.set(-2.0, -0.25, 0.1);

  const leftArmMesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.75, 6, 12),
    coatMaterial
  );

  leftArmMesh.position.y = -0.45;
  this.leftArm.add(leftArmMesh);

  this.leftArm.rotation.z = -0.5;
  this.scientist.add(this.leftArm);

  // RIGHT ARM
  this.rightArm = new THREE.Group();
  this.rightArm.position.set(-1.0, -0.25, 0.1);

  const rightArmMesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.75, 6, 12),
    coatMaterial
  );

  rightArmMesh.position.y = -0.45;
  this.rightArm.add(rightArmMesh);

  this.rightArm.rotation.z = 0.7;
  this.scientist.add(this.rightArm);

  this.scientist.position.y = 0.1;

  this.scene.add(this.scientist);
}



  private createMicroscope(): void {
    this.microscope = new THREE.Group();

    const metal = new THREE.MeshStandardMaterial({
      color: 0x9eb9d8,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x263a59,
      metalness: 0.7,
      roughness: 0.3,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x56cfff,
    });

    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.15, 0.9),
      darkMetal
    );

    base.position.set(0.9, -1.7, 0);
    this.microscope.add(base);

    // Vertical support
    const support = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 1.7, 24),
      metal
    );

    support.position.set(1.2, -0.8, 0);
    this.microscope.add(support);

    // Main optical tube
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.22, 1.25, 32),
      darkMetal
    );

    tube.position.set(0.7, 0.1, 0);
    tube.rotation.z = -0.65;
    this.microscope.add(tube);

    // Eyepiece
    const eyepiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.35, 24),
      metal
    );

    eyepiece.position.set(0.35, 0.58, 0);
    eyepiece.rotation.z = -0.65;
    this.microscope.add(eyepiece);

    // Objective lens
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 0.4, 24),
      glowMaterial
    );

    lens.position.set(1.05, -0.35, 0.05);
    lens.rotation.z = -0.65;
    this.microscope.add(lens);

    // Stage
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.09, 0.75),
      metal
    );

    stage.position.set(0.8, -0.85, 0.1);
    this.microscope.add(stage);

    // Focus knob
    const knob = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.07, 12, 32),
      metal
    );

    knob.position.set(1.35, -0.8, 0.35);
    this.microscope.add(knob);

    this.scene.add(this.microscope);
  }

  private createMolecules(): void {
    const colors = [0x56cfff, 0x9c7bff, 0x65f0d0];

    for (let i = 0; i < 12; i++) {
      const molecule = new THREE.Group();

      const color = colors[i % colors.length];

      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.3,
      });

      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 20, 20),
        material
      );

      molecule.add(center);

      for (let j = 0; j < 3; j++) {
        const angle = (j / 3) * Math.PI * 2;

        const atom = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 16),
          material
        );

        atom.position.set(
          Math.cos(angle) * 0.23,
          Math.sin(angle) * 0.23,
          0
        );

        molecule.add(atom);
      }

      molecule.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );

      molecule.userData['baseY'] = molecule.position.y;

      this.molecules.push(molecule);
      this.scene.add(molecule);
    }
  }

  private setupEvents(): void {
    const host = this.canvasHost.nativeElement;

    host.addEventListener('pointermove', this.onPointerMove);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    this.resizeObserver.observe(host);
  }

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.canvasHost.nativeElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private resize(): void {
    if (!this.renderer || !this.camera) return;

    const host = this.canvasHost.nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;

    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

 

private animate = (): void => {
  this.animationId = requestAnimationFrame(this.animate);

  const elapsed = this.clock.getElapsedTime();

  // SCIENTIST ANIMATION CYCLE
  const cycle = elapsed % 9;

  let lean = 0;

  // Move toward microscope
  if (cycle < 2) {
    const t = cycle / 2;
    lean = t * t * (3 - 2 * t);
  }

  // Inspect microscope
  else if (cycle < 5) {
    lean = 1;
  }

  // Return to normal position
  else if (cycle < 7) {
    const t = (cycle - 5) / 2;
    const smooth = t * t * (3 - 2 * t);
    lean = 1 - smooth;
  }

  // BODY MOVEMENT
  this.scientist.position.x = lean * 0.8;
  this.scientist.position.y =
    0.1 + Math.sin(elapsed * 1.5) * 0.015;

  this.body.rotation.z = -lean * 0.08;

  // HEAD MOVEMENT
  this.head.position.x = -1.5 + lean * 0.5;
  this.head.position.y = 0.35 - lean * 0.12;

  this.head.rotation.y = lean * 0.5;
  this.head.rotation.x = lean * 0.08;
  this.head.rotation.z = -lean * 0.12;

  // LEFT ARM
  this.leftArm.rotation.z =
    -0.5 + Math.sin(elapsed * 1.2) * 0.025;

  // RIGHT ARM - REACH MICROSCOPE
  this.rightArm.rotation.z =
    0.7 + lean * 0.65;

  // SUBTLE SCIENTIST MOVEMENT
  this.scientist.rotation.y =
    Math.sin(elapsed * 0.5) * 0.02;

  // MICROSCOPE
  this.microscope.rotation.y =
    Math.sin(elapsed * 0.4) * 0.025;

  // FLOATING MOLECULES
  this.molecules.forEach((molecule, index) => {
    molecule.position.y =
      molecule.userData['baseY'] +
      Math.sin(elapsed * 0.8 + index) * 0.12;

    molecule.rotation.z = elapsed * 0.25 + index;
  });

  // CAMERA INTERACTION
  this.camera.position.x +=
    (this.mouse.x * 0.25 - this.camera.position.x) * 0.025;

  this.camera.position.y +=
    (1.5 + this.mouse.y * 0.15 - this.camera.position.y) * 0.025;

  this.camera.lookAt(0, 0, 0);

  this.renderer.render(this.scene, this.camera);
};



  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);

    this.resizeObserver?.disconnect();

    if (this.canvasHost?.nativeElement) {
      this.canvasHost.nativeElement.removeEventListener(
        'pointermove',
        this.onPointerMove
      );
    }

    this.scene?.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      }
    });

    this.renderer?.dispose();
  }
}
