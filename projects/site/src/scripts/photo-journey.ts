class PhotoJourney extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;
  this.dataset.ready='true';
  const scenes=Array.from(this.querySelectorAll<HTMLElement>('[data-scene]'));
  const play=this.querySelector<HTMLButtonElement>('[data-play]')!;
  const sound=this.querySelector<HTMLButtonElement>('[data-audio]')!;
  const position=this.querySelector<HTMLOutputElement>('[data-position]')!;
  this.querySelector<HTMLElement>('[data-controls]')!.hidden=false;
  let index=0,timer:number|undefined,playing=false,ctx:AudioContext|undefined;
  const quiet=()=>{if(ctx){void ctx.close();ctx=undefined;}sound.textContent='Sound off';sound.setAttribute('aria-pressed','false');};
  const pause=()=>{playing=false;window.clearInterval(timer);timer=undefined;this.removeAttribute('data-playing');play.textContent='Play journey';play.setAttribute('aria-pressed','false');quiet();};
  const show=(next:number)=>{index=(next+scenes.length)%scenes.length;scenes.forEach((s,i)=>s.hidden=i!==index);position.textContent=`Chapter ${index+1} of ${scenes.length}`;};
  const start=()=>{playing=true;this.dataset.playing='true';play.textContent='Pause journey';play.setAttribute('aria-pressed','true');timer=window.setInterval(()=>{if(index===scenes.length-1){pause();return;}show(index+1);},8000);};
  play.addEventListener('click',()=>{if(playing)pause();else {if(index===scenes.length-1)show(0);start();}});
  this.querySelector('[data-prev]')!.addEventListener('click',()=>{pause();show(index-1);});
  this.querySelector('[data-next]')!.addEventListener('click',()=>{pause();show(index+1);});
  sound.addEventListener('click',async()=>{
   if(ctx){quiet();return;}
   try{
    ctx=new AudioContext();await ctx.resume();
    const master=ctx.createGain();master.gain.value=0.045;master.connect(ctx.destination);
    // Original quiet pentatonic pad. No sampled music or wildlife recordings.
    [130.81,196,261.63,293.66].forEach((frequency,i)=>{
     const tone=ctx!.createOscillator(),volume=ctx!.createGain();tone.type='sine';tone.frequency.value=frequency;
     volume.gain.setValueAtTime(0,ctx!.currentTime);volume.gain.linearRampToValueAtTime(0.17,ctx!.currentTime+2+i*.3);tone.connect(volume);volume.connect(master);tone.start();
    });
    // Filtered noise gives a soft surf-like texture without claiming a field recording.
    const buffer=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate),samples=buffer.getChannelData(0);
    for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.13;
    const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=450;noise.connect(filter);filter.connect(master);noise.start();
    sound.textContent='Sound on';sound.setAttribute('aria-pressed','true');
    if(!playing){if(index===scenes.length-1)show(0);start();}
   }catch{quiet();position.textContent='Audio is unavailable. You can still explore the photographs.';}
  });
  const full=this.querySelector<HTMLButtonElement>('[data-fullscreen]')!;
  if(!this.requestFullscreen)full.hidden=true;
  full.addEventListener('click',async()=>{try{if(document.fullscreenElement===this)await document.exitFullscreen();else await this.requestFullscreen();}catch{position.textContent='Full screen is unavailable in this browser.';}});
  const visibility=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',visibility);
  const leave=()=>pause();window.addEventListener('pagehide',leave);
  this.cleanup=()=>{pause();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',leave);};
 }
 cleanup?:()=>void;
 disconnectedCallback(){this.cleanup?.();}
}
if(!customElements.get('photo-journey'))customElements.define('photo-journey',PhotoJourney);
