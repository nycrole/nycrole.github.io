// Mobile menu toggle
const menuBtn = document.querySelectorAll('.js-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuBtn.forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    mobileMenu.classList.toggle('open');
  });
});
document.querySelectorAll('.mobile-menu a').forEach(a=>{
  a.addEventListener('click', ()=> mobileMenu.classList.remove('open'));
});

// reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('in');
  });
},{threshold:0.12});
reveals.forEach(r=>obs.observe(r));

// simple particle background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let DPR = window.devicePixelRatio || 1;
function resize(){
  canvas.width = innerWidth * DPR;
  canvas.height = innerHeight * DPR;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.scale(DPR,DPR);
}
resize();
window.addEventListener('resize', ()=>{
  DPR = window.devicePixelRatio || 1;
  resize();
});

const particles = [];
const PARTICLE_COUNT = Math.max(18, Math.round((innerWidth*innerHeight)/90000));
for(let i=0;i<PARTICLE_COUNT;i++){
  particles.push({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: 6 + Math.random()*18,
    vx: (Math.random()-0.5)*0.3,
    vy: (Math.random()-0.5)*0.3,
    hue: 205 + Math.random()*40,
    alpha: 0.08 + Math.random()*0.12
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < -100) p.x = innerWidth + 100;
    if(p.x > innerWidth + 100) p.x = -100;
    if(p.y < -100) p.y = innerHeight + 100;
    if(p.y > innerHeight + 100) p.y = -100;
    // glow
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
    g.addColorStop(0, `hsla(${p.hue},100%,60%,${p.alpha*0.9})`);
    g.addColorStop(0.25, `hsla(${p.hue},95%,55%,${p.alpha*0.6})`);
    g.addColorStop(1, `hsla(${p.hue},95%,30%,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();
