import "./template.style.scss";
import type { ITemplatePageProps } from "../../types";
import HeaderComponent from "../header/header.component";

const TemplateContainer = ({ component }: ITemplatePageProps) => {

  const canvas = document.querySelector('canvas')!,
    ctx = canvas.getContext('2d')!;

  // Setting the width and height of the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Setting up the letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');
  // Setting up the columns
  const fontSize = 10,
      columns = canvas.width / fontSize;

  // Setting up the drops
  const drops: number[] = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  // Setting up the draw function
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#0f0';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
        drops[i] = 0;
      }
    }
  }

  // Loop the animation
  setInterval(draw, 33);

  return (
    <canvas className="background">
      <HeaderComponent />
      <main>{component}</main>
    </canvas>
  );
};

export default TemplateContainer;
