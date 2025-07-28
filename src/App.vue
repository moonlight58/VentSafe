<template>
  <div id="app">
    <div class="background">
      <!-- Stars -->
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's',
        }"
      ></div>

      <!-- Floating colored shapes -->
      <div
        v-for="shape in shapes"
        :key="shape.id"
        class="floating-shape"
        :style="{
          width: shape.size + 'px',
          height: shape.size + 'px',
          left: shape.x + '%',
          top: shape.y + '%',
          backgroundColor: shape.color,
          animation: `float-${shape.id} ${shape.duration}s ease-in-out infinite`,
        }"
      ></div>
    </div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      stars: [],
      shapes: [],
    };
  },
  methods: {
    generateStars() {
      for (let i = 0; i < 50; i++) {
        this.stars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 3,
          duration: Math.random() * 3 + 2,
        });
      }
    },
    generateShapes() {
      const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];
      for (let i = 0; i < 8; i++) {
        this.shapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 200 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 10 + 15,
        });
      }
    },
    generateFloatingAnimations() {
      const style = document.createElement("style");
      let css = "";

      this.shapes.forEach((shape) => {
        css += `
        @keyframes float-${shape.id} {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
          50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); }
          75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
        }`;
      });

      style.textContent = css;
      document.head.appendChild(style);
    },
  },
  mounted() {
    this.generateStars();
    this.generateShapes();
    this.generateFloatingAnimations();
  },
};
</script>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
}
</style>
