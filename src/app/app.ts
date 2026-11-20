
import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

import { ScienceLabThree } from './science-lab-three/science-lab-three';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MagneticMotion = {
  x: (value: number) => void;
  y: (value: number) => void;
};
type SpaceLayerMotion = {
  x: (value: number) => void;
  y: (value: number) => void;
  depth: number;
};
type PlanetMotion = {
  x: (value: number) => void;
  y: (value: number) => void;
  scale: (value: number) => void;
  depth: number;
};
@Component({
  selector: 'app-root',
  imports: [ScienceLabThree],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {

  private animationContext?: gsap.Context;
  cursorOnLink = false;

  // Orb movement
  private moveOrbX?: (value: number) => void;
  private moveOrbY?: (value: number) => void;
  private rotateOrbX?: (value: number) => void;
  private rotateOrbY?: (value: number) => void;

  // Custom cursor movement
  private moveCursorX?: (value: number) => void;
  private moveCursorY?: (value: number) => void;

  // Magnetic buttons
  private magneticButtons = new Map<HTMLElement, MagneticMotion>();
  private spaceLayers = new Map<HTMLElement, SpaceLayerMotion>();
  // Planet Interactive Movement
private planetMotions = new Map<HTMLElement, PlanetMotion>();

  ngAfterViewInit(): void {

    this.animationContext = gsap.context(() => {

      // =================================
      // 1. HERO INTRO ANIMATION
      // =================================

      const introTimeline = gsap.timeline({
        defaults: {
          ease: 'power3.out'
        }
      });

      introTimeline.fromTo(
        '.hero-letter',
        {
          y: 120,
          opacity: 0,
          rotationX: -90,
          scale: 0.7
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out'
        }
      );

      introTimeline.fromTo(
        '.hero-subtitle',
        {
          y: 25,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9
        },
        '-=0.5'
      );

      introTimeline.fromTo(
        '.hero-actions',
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8
        },
        '-=0.4'
      );

          // =================================
      // 2. ORB INTERACTION
      // =================================

      this.moveOrbX = gsap.quickTo('.orb-wrap', 'x', {
        duration: 0.8,
        ease: 'power3.out'
      });

      this.moveOrbY = gsap.quickTo('.orb-wrap', 'y', {
        duration: 0.8,
        ease: 'power3.out'
      });

      this.rotateOrbX = gsap.quickTo('.orb-wrap', 'rotationX', {
        duration: 0.8,
        ease: 'power3.out'
      });

      this.rotateOrbY = gsap.quickTo('.orb-wrap', 'rotationY', {
        duration: 0.8,
        ease: 'power3.out'
      });
// =================================
// PLANETS INTERACTION SETUP
// =================================

const planets = document.querySelectorAll<HTMLElement>(
  '.orbit-planet'
);

planets.forEach((planet, index) => {

  const depth = 5 + index * 2;

  this.planetMotions.set(planet, {

    x: gsap.quickTo(planet, 'x', {
      duration: 1,
      ease: 'power3.out'
    }),

    y: gsap.quickTo(planet, 'y', {
      duration: 1,
      ease: 'power3.out'
    }),

    scale: gsap.quickTo(planet, 'scale', {
      duration: 0.45,
      ease: 'power3.out'
    }),

    depth

  });

});
      // =================================
      // 6. SELECTED WORKS - HORIZONTAL SCROLL
      // =================================

      const worksPin = document.querySelector<HTMLElement>('.works-pin');
      const worksTrack = document.querySelector<HTMLElement>('.works-track');
      const progressFill = document.querySelector<HTMLElement>('.progress-fill');

      if (worksPin && worksTrack && progressFill) {

        const worksMedia = gsap.matchMedia();

        worksMedia.add('(min-width: 769px)', () => {

          const getScrollDistance = () =>
            Math.max(0, worksTrack.scrollWidth - worksPin.clientWidth);

          if (getScrollDistance() <= 0) return;

          gsap.set(progressFill, {
            scaleX: 0,
            transformOrigin: 'left center'
          });

          // Horizontal movement
          const horizontalTween = gsap.to(worksTrack, {
            x: () => -getScrollDistance(),
            ease: 'none',

            scrollTrigger: {
              trigger: worksPin,
              start: 'top top',
              end: () => `+=${getScrollDistance()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              onUpdate: (self) => {
                gsap.set(progressFill, {
                  scaleX: self.progress
                });
              }
            }
          });

          
          // Project Reveal Animation
          gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {

            const image = card.querySelector('.work-image');
            const info = card.querySelector('.work-info');
            const technologies = card.querySelectorAll('.work-tech span');

            const revealTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: 'left 80%',
                end: 'left 35%',
                toggleActions: 'play none none reverse'
              }
            });

           // Image Reveal - Smooth Depth Animation
if (image) {
  revealTimeline.fromTo(
    image,
    {
      opacity: 0,
      y: 35,
      rotationX: 5,
      clipPath: 'inset(8% 0 8% 0)',
      filter: 'blur(8px)'
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      clipPath: 'inset(0% 0 0% 0)',
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power4.out'
    }
  );
}

         // Project Information - Elegant Reveal
if (info) {
  revealTimeline.fromTo(
    info,
    {
      opacity: 0,
      y: 40,
      filter: 'blur(5px)'
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out'
    },
    '-=0.7'
  );
}

            // Technologies - Stagger Reveal
if (technologies.length > 0) {
  revealTimeline.fromTo(
    technologies,
    {
      opacity: 0,
      y: 18,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.4)'
    },
    '-=0.45'
  );
}

          });


        });

      }



      // =================================
      // 3. CUSTOM CURSOR
      // =================================

      gsap.set('.custom-cursor', {
        xPercent: -50,
        yPercent: -50
      });

      this.moveCursorX = gsap.quickTo(
        '.custom-cursor',
        'x',
        {
          duration: 0.25,
          ease: 'power3.out'
        }
      );

      this.moveCursorY = gsap.quickTo(
        '.custom-cursor',
        'y',
        {
          duration: 0.25,
          ease: 'power3.out'
        }
      );
// =================================
// GLOBAL SPACE PARALLAX SETUP
// =================================

const spaceLayers = document.querySelectorAll<HTMLElement>(
  '.space-stars, .space-glow-one, .space-glow-two'
);

spaceLayers.forEach((layer) => {

  const depth = layer.classList.contains('space-stars')
    ? 12
    : layer.classList.contains('space-glow-one')
      ? 25
      : 18;

  this.spaceLayers.set(layer, {
    x: gsap.quickTo(layer, 'x', {
      duration: 1.2,
      ease: 'power3.out'
    }),
    y: gsap.quickTo(layer, 'y', {
      duration: 1.2,
      ease: 'power3.out'
    }),
    depth
  });

});

      // =================================
      // 4. MAGNETIC BUTTONS
      // =================================

      const buttons =
        document.querySelectorAll<HTMLElement>('.magnetic-btn');

      buttons.forEach((button) => {

        const moveX = gsap.quickTo(button, 'x', {
          duration: 0.4,
          ease: 'power3.out'
        });

        const moveY = gsap.quickTo(button, 'y', {
          duration: 0.4,
          ease: 'power3.out'
        });

        this.magneticButtons.set(button, {
          x: moveX,
          y: moveY
        });

      });


      // =================================
      // 5. MANIFESTO SCROLL REVEAL
      // =================================

      // Top Labels Animation

      gsap.fromTo(
        '.manifesto-top',
        {
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,

          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );


      // =================================
// TEXT MASK SCROLL REVEAL
// =================================

const textRevealTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.manifesto-title',
    start: 'top 80%',
    end: 'bottom 45%',
    scrub: 1
  }
});

textRevealTimeline.fromTo(
  '.reveal-text',
  {
    yPercent: 110,
    opacity: 0,
    rotationX: -12
  },
  {
    yPercent: 0,
    opacity: 1,
    rotationX: 0,
    duration: 1,
    stagger: 0.18,
    ease: 'none'
  }
);


      // Description Animation

      gsap.fromTo(
        '.manifesto-description',
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,

          scrollTrigger: {
            trigger: '.manifesto-description',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );


      // Footer Animation

      gsap.fromTo(
        '.manifesto-footer',
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,

          scrollTrigger: {
            trigger: '.manifesto-footer',
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    });

  }


  // =================================
  // 6. MOUSE MOVEMENT OVER HERO
  // =================================



// =================================
// GLOBAL CUSTOM CURSOR
// =================================

onGlobalPointerMove(event: PointerEvent): void {

  if (event.pointerType !== 'mouse') {
    return;
  }

  gsap.set('.custom-cursor', {
    opacity: 1
  });

  this.moveCursorX?.(event.clientX);
  this.moveCursorY?.(event.clientY);

  const target = event.target;

  this.cursorOnLink =
    target instanceof Element &&
    !!target.closest('.work-card a, .work-card button');

  // Global Space Movement
  const mouseX = event.clientX / window.innerWidth - 0.5;
  const mouseY = event.clientY / window.innerHeight - 0.5;

  this.spaceLayers.forEach((layer) => {
    layer.x(-mouseX * layer.depth);
    layer.y(-mouseY * layer.depth);
  });
// =================================
// INTERACTIVE PLANETS
// =================================

this.planetMotions.forEach((motion, planet) => {

  const rect = planet.getBoundingClientRect();

  const planetX = rect.left + rect.width / 2;
  const planetY = rect.top + rect.height / 2;

  // Mouse distance from planet
  const distanceX = event.clientX - planetX;
  const distanceY = event.clientY - planetY;

  const distance = Math.sqrt(
    distanceX * distanceX + distanceY * distanceY
  );

  // Planet parallax
  motion.x(-mouseX * motion.depth);
  motion.y(-mouseY * motion.depth);

  // Proximity interaction
 const isNear = distance < 120;

  motion.scale(isNear ? 1.35 : 1);

  planet.classList.toggle('is-near', isNear);

});
}


onGlobalPointerLeave(): void {

  this.cursorOnLink = false;

  gsap.to('.custom-cursor', {
    opacity: 0,
    duration: 0.2
  });
// Reset Space Layers
this.spaceLayers.forEach((layer) => {
  layer.x(0);
  layer.y(0);
});
// Reset Planet Interactions
this.planetMotions.forEach((motion, planet) => {

  motion.x(0);
  motion.y(0);
  motion.scale(1);

  planet.classList.remove('is-near');

});
}
  // =================================
  // 7. RESET ORB AND CURSOR
  // =================================

 

// =================================
// ORB MOVEMENT OVER HERO
// =================================

onPointerMove(event: PointerEvent): void {

  if (event.pointerType !== 'mouse') {
    return;
  }

  const hero = event.currentTarget as HTMLElement;
  const rect = hero.getBoundingClientRect();

  const mouseX =
    (event.clientX - rect.left) / rect.width - 0.5;

  const mouseY =
    (event.clientY - rect.top) / rect.height - 0.5;

  // Move Orb
  this.moveOrbX?.(-mouseX * 50);
  this.moveOrbY?.(-mouseY * 40);

  this.rotateOrbX?.(-mouseY * 20);
  this.rotateOrbY?.(mouseX * 20);

}


// =================================
// RESET ORB
// =================================

onPointerLeave(): void {

  this.moveOrbX?.(0);
  this.moveOrbY?.(0);

  this.rotateOrbX?.(0);
  this.rotateOrbY?.(0);

}
  // =================================
  // 8. MAGNETIC BUTTON MOVEMENT
  // =================================

  onMagneticMove(event: PointerEvent): void {

    if (event.pointerType !== 'mouse') {
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const magnetic = this.magneticButtons.get(button);

    magnetic?.x(distanceX * 0.25);
    magnetic?.y(distanceY * 0.25);

  }


  // =================================
  // 9. RESET MAGNETIC BUTTON
  // =================================

  onMagneticLeave(event: PointerEvent): void {

    const button = event.currentTarget as HTMLElement;
    const magnetic = this.magneticButtons.get(button);

    magnetic?.x(0);
    magnetic?.y(0);

  }
// =================================
// PROJECT IMAGE PARALLAX
// =================================

onProjectMove(event: PointerEvent): void {

  if (event.pointerType !== 'mouse') {
    return;
  }

  const card = event.currentTarget as HTMLElement;
  const image = card.querySelector<HTMLElement>('.work-image img');

  if (!image) return;

  const rect = card.getBoundingClientRect();

  const mouseX =
    (event.clientX - rect.left) / rect.width - 0.5;

  const mouseY =
    (event.clientY - rect.top) / rect.height - 0.5;

  const moveX = -mouseX * 16;
  const moveY = -mouseY * 16;

  image.style.setProperty('--parallax-x', `${moveX}px`);
  image.style.setProperty('--parallax-y', `${moveY}px`);
}


onProjectLeave(event: PointerEvent): void {

  const card = event.currentTarget as HTMLElement;
  const image = card.querySelector<HTMLElement>('.work-image img');

  if (!image) return;

  image.style.setProperty('--parallax-x', '0px');
  image.style.setProperty('--parallax-y', '0px');

}

  // =================================
  // 10. CLEANUP
  // =================================

  ngOnDestroy(): void {

    this.animationContext?.revert();
    this.magneticButtons.clear();
 this.spaceLayers.clear();
 this.planetMotions.clear();
  }

}
