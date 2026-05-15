/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14262f",
        mist: "#6d858d",
        glow: "#84c7bc",
        aqua: "#4da795",
        steel: "#21404c",
        blush: "#e7b29f",
        pearl: "#f6f1ea",
        pine: "#183640",
        cloud: "#fffdf9",
        slate: "#e8ece8"
      },
      boxShadow: {
        glow: "0 16px 55px rgba(77, 167, 149, 0.18)",
        soft: "0 24px 70px rgba(20, 38, 47, 0.12)",
        card: "0 12px 32px rgba(20, 38, 47, 0.08)"
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at top left, rgba(132,199,188,0.16), transparent 34%), radial-gradient(circle at top right, rgba(231,178,159,0.18), transparent 30%), radial-gradient(circle at bottom center, rgba(77,167,149,0.1), transparent 38%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 18s linear infinite",
        pulseSlow: "pulse 4s ease-in-out infinite",
        tilt: "tilt 10s ease-in-out infinite",
        rise: "rise 7s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" }
        },
        drift: {
          "0%": { transform: "translate3d(-10%, 0, 0) rotate(0deg)" },
          "100%": { transform: "translate3d(10%, -8%, 0) rotate(360deg)" }
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-4deg) translateY(0px)" },
          "50%": { transform: "rotate(4deg) translateY(-10px)" }
        },
        rise: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};
