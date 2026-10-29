// Tailwind 3.4 설정 (Figma "Bitcoin direction call" KO 화면 토큰)
module.exports = {
  content: ['./src/proto.html'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2F5BEA', deep: '#1D4ED8', soft: '#EAF0FF' },
        ink: '#14171C', mute: '#6B7280', faint: '#9CA3AF', line: '#EEF0F3', sunk: '#F7F8FA', bg: '#F5F7FB',
        up: { DEFAULT: '#0B7A55', bar: '#0E9F6E', soft: '#E3F8EF' },
        down: { DEFAULT: '#B4233A', bar: '#E0384F', soft: '#FDE8EB' },
        amber: { DEFAULT: '#B4620E', soft: '#FFF4E3' },
      },
      fontFamily: { sans: ['"Noto Sans KR"', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'] },
    },
  },
};
