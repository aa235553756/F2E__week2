/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    container:{
      center:true,
      screens: {
        '2xl': '1472px',
      },
    },
    extend: {
      boxShadow: {
        'btn': '0px 4px 4px 0px #EEEDE8',
        'CreateName':'0px 4px 4px 0px #00000033',
        'CreatePaint': '0px -4px 4px 0px #00000033'
      },
      screens: {
        '2xl': '1440px',
      },
      colors:{
        'secondary':'#51A8BC',
        'light-main':'#FFFAF4',
        'primary':'#F9B471',
        'dark-gray':'#A5A39C',
      }
    },
  },
  plugins: [],
}
