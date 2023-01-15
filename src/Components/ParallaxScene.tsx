import { onMount, Component } from "solid-js";
import Parallax from "parallax-js";

export const ParallaxScene: Component = () => {
  onMount(() => {
    const scene = document.getElementById("scene");
    const parallaxInstance = new Parallax(scene!, {
      relativeInput: true,
    });

    parallaxInstance.friction(0.2, 0.2);
  });

  return (
    <div id="scene" class="fixed inset-0 overflow-hidden">
      <div
        data-depth="0.2"
        class="
    absolute
    top-0
    left-0
    w-full

  "
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="fill-primary h-[55vh] w-[160vw] absolute -top-[5vw] -left-[50vw]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <div
        data-depth="0.8"
        class="
    absolute
    bottom-0
    left-0
    w-full

    leading-[0]
    rotate-180
    "
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="
        absolute
        h-[80vh]
        w-[150vw]
        block
        fill-success
        rotate-180
        -bottom-[5vh]
        -left-[10vw]
      "
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};
