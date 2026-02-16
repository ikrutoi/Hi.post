// const pieElement = document.querySelector(
//   '.your-pie-selector',
// ) as HTMLElement | null

// export function stopAnimationSmoothly() {
//   if (!pieElement) return

//   pieElement.addEventListener(
//     'animationiteration',
//     () => {
//       pieElement.classList.remove('pie-rotating')
//       pieElement.style.transform = 'rotate(0deg)'
//     },
//     { once: true },
//   )
// }

// export function toggleAnimation(isActive: boolean) {
//   if (!pieElement) return

//   if (isActive) {
//     pieElement.style.transform = ''
//     pieElement.classList.add('pie-rotating')
//   } else {
//     pieElement.addEventListener(
//       'animationiteration',
//       () => {
//         pieElement.classList.remove('pie-rotating')
//         pieElement.style.transform = 'rotate(0deg)'
//       },
//       { once: true },
//     )
//   }
// }
