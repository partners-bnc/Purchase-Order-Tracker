import React, { useEffect, useRef } from "react";

const FLOWER_CSS = `
.flower-scene {
  position: absolute;
  bottom: 0;
  right: 170px;
  width: 380px;
  height: 380px;
  overflow: visible;
  pointer-events: none;
  z-index: 3;
  transform: scale(0.48);
  transform-origin: bottom right;
}
.flower-scene .flowers {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: scale(0.9);
}
.flower-scene .flower {
  position: absolute;
  bottom: 10vmin;
  transform-origin: bottom center;
  z-index: 10;
  --fl-speed: 0.8s;
}
.flower-scene .flower--1 { animation: fs-moving-flower-1 4s linear infinite; }
.flower-scene .flower--2 { left: 50%; transform: rotate(20deg); animation: fs-moving-flower-2 4s linear infinite; }
.flower-scene .flower--3 { left: 50%; transform: rotate(-15deg); animation: fs-moving-flower-3 4s linear infinite; }

.flower-scene .flower__leafs {
  position: relative;
  animation: fs-blooming-flower 2s backwards;
}
.flower-scene .flower__leafs--1 { animation-delay: 1.1s; }
.flower-scene .flower__leafs--2 { animation-delay: 1.4s; }
.flower-scene .flower__leafs--3 { animation-delay: 1.7s; }
.flower-scene .flower__leafs::after {
  content: "";
  position: absolute;
  left: 0; top: 0;
  transform: translate(-50%, -100%);
  width: 8vmin; height: 8vmin;
  background-color: #0D9488;
  filter: blur(10vmin);
}
.flower-scene .flower__leaf {
  position: absolute;
  bottom: 0; left: 50%;
  width: 8vmin; height: 11vmin;
  border-radius: 51% 49% 47% 53% / 44% 45% 55% 69%;
  background-color: #a7ffee;
  background-image: linear-gradient(to top, #0D9488, #a7ffee);
  transform-origin: bottom center;
  opacity: 0.9;
  box-shadow: inset 0 0 2vmin rgba(255,255,255,0.5);
}
.flower-scene .flower__leaf--1 { transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg); }
.flower-scene .flower__leaf--2 { transform: translate(-50%, -4%) rotateX(40deg); }
.flower-scene .flower__leaf--3 { transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg); }
.flower-scene .flower__leaf--4 {
  width: 8vmin; height: 8vmin;
  transform-origin: bottom left;
  border-radius: 4vmin 10vmin 4vmin 4vmin;
  transform: translate(-0%, 18%) rotateX(70deg) rotate(-43deg);
  background-image: linear-gradient(to top, #0F766E, #a7ffee);
  z-index: 1; opacity: 0.8;
}
.flower-scene .flower__white-circle {
  position: absolute;
  left: -3.5vmin; top: -3vmin;
  width: 9vmin; height: 4vmin;
  border-radius: 50%;
  background-color: #fff;
}
.flower-scene .flower__white-circle::after {
  content: "";
  position: absolute;
  left: 50%; top: 45%;
  transform: translate(-50%, -50%);
  width: 60%; height: 60%;
  border-radius: inherit;
  background-image: linear-gradient(90deg, #0D9488, #CCFBF1);
}
.flower-scene .flower__line {
  width: 1.5vmin;
  background-image: linear-gradient(to left, rgba(0,0,0,0.2), transparent, rgba(255,255,255,0.2)),
    linear-gradient(to top, transparent 10%, #0F766E, #0D9488);
  box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
  animation: fs-grow-flower-tree 4s backwards;
}
.flower-scene .flower--1 .flower__line { height: 70vmin; animation-delay: 0.3s; }
.flower-scene .flower--2 .flower__line { height: 60vmin; animation-delay: 0.6s; }
.flower-scene .flower--3 .flower__line { height: 55vmin; animation-delay: 0.9s; }

.flower-scene .flower__line__leaf {
  --w: 7vmin; --h: calc(var(--w) + 2vmin);
  position: absolute;
  top: 20%; left: 90%;
  width: var(--w); height: var(--h);
  border-top-right-radius: var(--h);
  border-bottom-left-radius: var(--h);
  background-image: linear-gradient(to top, rgba(13,148,136,0.4), #0D9488);
}
.flower-scene .flower__line__leaf--1 { animation: fs-blooming-leaf-right var(--fl-speed) 1.6s backwards; }
.flower-scene .flower__line__leaf--2 { animation: fs-blooming-leaf-right var(--fl-speed) 1.4s backwards; }
.flower-scene .flower__line__leaf--3 { border-top-right-radius:0; border-bottom-left-radius:0; border-top-left-radius:var(--h); border-bottom-right-radius:var(--h); left:-460%; top:12%; animation: fs-blooming-leaf-left var(--fl-speed) 1.2s backwards; }
.flower-scene .flower__line__leaf--4 { border-top-right-radius:0; border-bottom-left-radius:0; border-top-left-radius:var(--h); border-bottom-right-radius:var(--h); left:-460%; top:40%; animation: fs-blooming-leaf-left var(--fl-speed) 1s backwards; }
.flower-scene .flower__line__leaf--5 { top:0; animation: fs-blooming-leaf-right var(--fl-speed) 1.8s backwards; }
.flower-scene .flower__line__leaf--6 { border-top-right-radius:0; border-bottom-left-radius:0; border-top-left-radius:var(--h); border-bottom-right-radius:var(--h); left:-450%; top:-2%; animation: fs-blooming-leaf-left var(--fl-speed) 2s backwards; }

.flower-scene .flower__light {
  position: absolute;
  bottom: 0; width: 1vmin; height: 1vmin;
  background-color: #0D9488;
  border-radius: 50%;
  filter: blur(0.2vmin);
  animation: fs-light-ans 4s linear infinite backwards;
}
.flower-scene .flower__light:nth-child(odd) { background-color: #5EEAD4; }
.flower-scene .flower__light--1 { left:-2vmin; animation-delay:1s; }
.flower-scene .flower__light--2 { left:3vmin; animation-delay:0.5s; }
.flower-scene .flower__light--3 { left:-6vmin; animation-delay:0.3s; }
.flower-scene .flower__light--4 { left:6vmin; animation-delay:0.9s; }
.flower-scene .flower__light--5 { left:-1vmin; animation-delay:1.5s; }
.flower-scene .flower__light--6 { left:-4vmin; animation-delay:3s; }
.flower-scene .flower__light--7 { left:3vmin; animation-delay:2s; }
.flower-scene .flower__light--8 { left:-6vmin; animation-delay:3.5s; }

.flower-scene .grow-ans { animation: fs-grow-ans 2s var(--d) backwards; }
.flower-scene .growing-grass { animation: fs-growing-grass-ans 1s 2s backwards; }

.flower-scene .flower__grass {
  --c: #0D9488; --line-w: 1.5vmin;
  position: absolute; bottom: 12vmin; left: -7vmin;
  display: flex; flex-direction: column; align-items: flex-end;
  z-index: 20; transform-origin: bottom center;
  transform: rotate(-48deg) rotateY(40deg);
}
.flower-scene .flower__grass--1 { animation: fs-moving-grass 2s linear infinite; }
.flower-scene .flower__grass--2 { left:2vmin; bottom:10vmin; transform:scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg); opacity:0.8; z-index:0; animation: fs-moving-grass--2 1.5s linear infinite; }
.flower-scene .flower__grass--top { width:7vmin; height:10vmin; border-top-right-radius:100%; border-right:var(--line-w) solid var(--c); transform-origin:bottom center; transform:rotate(-2deg); }
.flower-scene .flower__grass--bottom { margin-top:-2px; width:var(--line-w); height:25vmin; background-image:linear-gradient(to top, transparent, var(--c)); }
.flower-scene .flower__grass__overlay { position:absolute; top:-10%; right:0; width:100%; height:100%; background-color:rgba(240,253,250,0.4); filter:blur(1.5vmin); z-index:100; }

.flower-scene .flower__g-long {
  --w:2vmin; --h:6vmin; --c:#0D9488;
  position:absolute; bottom:10vmin; left:-3vmin;
  transform-origin:bottom center; transform:rotate(-30deg) rotateY(-20deg);
  display:flex; flex-direction:column; align-items:flex-end;
  animation: fs-flower-g-long-ans 3s linear infinite;
}
.flower-scene .flower__g-long__top { top:calc(var(--h)*-1); width:calc(var(--w)+1vmin); height:var(--h); border-top-right-radius:100%; border-right:0.7vmin solid var(--c); transform:translate(-0.7vmin,1vmin); }
.flower-scene .flower__g-long__bottom { width:var(--w); height:50vmin; transform-origin:bottom center; background-image:linear-gradient(to top, transparent 30%, var(--c)); box-shadow:inset 0 0 2px rgba(0,0,0,0.5); clip-path:polygon(35% 0, 65% 1%, 100% 100%, 0% 100%); }

.flower-scene .long-g {
  position:absolute; bottom:25vmin; left:-42vmin; transform-origin:bottom left;
}
.flower-scene .long-g--1 { bottom:0; transform:scale(0.8) rotate(-5deg); }
.flower-scene .long-g--2,.flower-scene .long-g--3 { bottom:-3vmin; left:-35vmin; transform-origin:center; transform:scale(0.6) rotateX(60deg); }
.flower-scene .long-g--3 { left:-17vmin; bottom:0; }
.flower-scene .long-g--4 { left:25vmin; bottom:-3vmin; transform-origin:center; transform:scale(0.6) rotateX(60deg); }
.flower-scene .long-g--5 { left:42vmin; bottom:0; transform:scale(0.8) rotate(2deg); }
.flower-scene .long-g--6 { left:0; bottom:-20vmin; z-index:100; filter:blur(0.3vmin); transform:scale(0.8) rotate(2deg); }
.flower-scene .long-g--7 { left:35vmin; bottom:20vmin; z-index:-1; filter:blur(0.3vmin); transform:scale(0.6) rotate(2deg); opacity:0.7; }

.flower-scene .leaf {
  --w:15vmin; --h:40vmin; --c:#0D9488;
  position:absolute; bottom:0;
  width:var(--w); height:var(--h);
  border-top-left-radius:100%;
  border-left:2vmin solid var(--c);
  -webkit-mask-image:linear-gradient(to top, transparent 20%, #0D9488);
  transform-origin:bottom center;
}
.flower-scene .leaf--0 { left:2vmin; animation:fs-leaf-ans-1 4s linear infinite; }
.flower-scene .leaf--1 { --w:5vmin; --h:60vmin; animation:fs-leaf-ans-1 4s linear infinite; }
.flower-scene .leaf--2 { --w:10vmin; --h:40vmin; left:-0.5vmin; bottom:5vmin; transform-origin:bottom left; transform:rotateY(-180deg); animation:fs-leaf-ans-2 3s linear infinite; }
.flower-scene .leaf--3 { --w:5vmin; --h:30vmin; left:-1vmin; bottom:3.2vmin; transform-origin:bottom left; transform:rotate(-10deg) rotateY(-180deg); animation:fs-leaf-ans-3 3s linear infinite; }

/* KEYFRAMES */
@keyframes fs-moving-flower-1 { 0%,100%{transform:rotate(2deg);} 50%{transform:rotate(-2deg);} }
@keyframes fs-moving-flower-2 { 0%,100%{transform:rotate(18deg);} 50%{transform:rotate(14deg);} }
@keyframes fs-moving-flower-3 { 0%,100%{transform:rotate(-18deg);} 50%{transform:rotate(-20deg) rotateY(-10deg);} }
@keyframes fs-blooming-leaf-right { 0%{transform-origin:left; transform:rotate(70deg) rotateY(30deg) scale(0);} }
@keyframes fs-blooming-leaf-left  { 0%{transform-origin:right; transform:rotate(-70deg) rotateY(30deg) scale(0);} }
@keyframes fs-grow-flower-tree { 0%{height:0; border-radius:1vmin;} }
@keyframes fs-blooming-flower { 0%{transform:scale(0);} }
@keyframes fs-moving-grass { 0%,100%{transform:rotate(-48deg) rotateY(40deg);} 50%{transform:rotate(-50deg) rotateY(40deg);} }
@keyframes fs-moving-grass--2 { 0%,100%{transform:scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);} 50%{transform:scale(0.5) rotate(79deg) rotateX(10deg) rotateY(-200deg);} }
@keyframes fs-growing-grass-ans { 0%{transform:scale(0);} }
@keyframes fs-grow-ans { 0%{transform:scale(0); opacity:0;} }
@keyframes fs-flower-g-long-ans { 0%,100%{transform:rotate(-30deg) rotateY(-20deg);} 50%{transform:rotate(-32deg) rotateY(-20deg);} }
@keyframes fs-light-ans {
  0%{opacity:0; transform:translateY(0);}
  25%{opacity:1; transform:translateY(-5vmin) translateX(-2vmin);}
  50%{opacity:1; transform:translateY(-15vmin) translateX(2vmin); filter:blur(0.2vmin);}
  75%{transform:translateY(-20vmin) translateX(-2vmin); filter:blur(0.2vmin);}
  100%{transform:translateY(-30vmin); opacity:0; filter:blur(1vmin);}
}
@keyframes fs-leaf-ans-1 { 0%,100%{transform:rotate(-5deg) scale(1);} 50%{transform:rotate(5deg) scale(1.1);} }
@keyframes fs-leaf-ans-2 { 0%,100%{transform:rotateY(-180deg) rotate(5deg);} 50%{transform:rotateY(-180deg) rotate(0deg) scale(1.1);} }
@keyframes fs-leaf-ans-3 { 0%,100%{transform:rotate(-10deg) rotateY(-180deg);} 50%{transform:rotate(-20deg) rotateY(-180deg);} }
`;

function FlowerPetals() {
  return (
    <div className="flower__leafs">
      <div className="flower__leaf flower__leaf--1" />
      <div className="flower__leaf flower__leaf--2" />
      <div className="flower__leaf flower__leaf--3" />
      <div className="flower__leaf flower__leaf--4" />
      <div className="flower__white-circle" />
      {[1,2,3,4,5,6,7,8].map(n=><div key={n} className={`flower__light flower__light--${n}`}/>)}
    </div>
  );
}

export default function FlowerScene() {
  const ref = useRef();
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.classList.remove("not-loaded");
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{FLOWER_CSS}</style>
      <div className="flower-scene not-loaded" ref={ref}>
        <div className="flowers">

          <div className="flower flower--1">
            <FlowerPetals />
            <div className="flower__line">
              {[1,2,3,4,5,6].map(n=><div key={n} className={`flower__line__leaf flower__line__leaf--${n}`}/>)}
            </div>
          </div>

          <div className="flower flower--2">
            <FlowerPetals />
            <div className="flower__line">
              {[1,2,3,4].map(n=><div key={n} className={`flower__line__leaf flower__line__leaf--${n}`}/>)}
            </div>
          </div>

          <div className="flower flower--3">
            <FlowerPetals />
            <div className="flower__line">
              {[1,2,3,4].map(n=><div key={n} className={`flower__line__leaf flower__line__leaf--${n}`}/>)}
            </div>
          </div>

          <div className="grow-ans" style={{"--d":"1.2s"}}>
            <div className="flower__g-long">
              <div className="flower__g-long__top"/>
              <div className="flower__g-long__bottom"/>
            </div>
          </div>

          <div className="growing-grass">
            <div className="flower__grass flower__grass--1">
              <div className="flower__grass--top"/><div className="flower__grass--bottom"/>
              {[1,2,3,4,5,6,7,8].map(n=><div key={n} className={`flower__grass__leaf flower__grass__leaf--${n}`}/>)}
              <div className="flower__grass__overlay"/>
            </div>
          </div>

          <div className="growing-grass">
            <div className="flower__grass flower__grass--2">
              <div className="flower__grass--top"/><div className="flower__grass--bottom"/>
              {[1,2,3,4,5,6,7,8].map(n=><div key={n} className={`flower__grass__leaf flower__grass__leaf--${n}`}/>)}
              <div className="flower__grass__overlay"/>
            </div>
          </div>

          {[
            {d:"3s",cls:"leaf--0"},{d:"2.2s",cls:"leaf--1"},
            {d:"3.4s",cls:"leaf--2"},{d:"3.6s",cls:"leaf--3"},
          ].map((l,i)=>(
            <div key={i} className="long-g long-g--0">
              <div className="grow-ans" style={{"--d":l.d}}>
                <div className={`leaf ${l.cls}`}/>
              </div>
            </div>
          ))}

          {[[1,["3.6s","3.8s","4s","4.2s"]],[2,["4s","4.2s","4.4s","4.6s"]],[3,["4s","4.2s","3s","3.6s"]],[4,["4s","4.2s","3s","3.6s"]],[5,["4s","4.2s","3s","3.6s"]]].map(([n,delays])=>(
            <div key={n} className={`long-g long-g--${n}`}>
              {delays.map((d,i)=>(
                <div key={i} className="grow-ans" style={{"--d":d}}>
                  <div className={`leaf leaf--${i}`}/>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
