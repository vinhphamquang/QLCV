/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: 'tw', // Thêm cái này để không bị trùng tên class với bạn ông
  corePlugins: {
    preflight: false, // Tắt reset mặc định để không làm vỡ font/margin cũ
  },
  theme: {
    extend: {},
  },
  plugins: [],
}