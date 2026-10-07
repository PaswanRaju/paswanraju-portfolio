// Scroll reveals run from two tiny inline scripts instead of React, so they work before hydration,
// never change React-managed attributes (no hydration mismatches), and cannot leave content hidden:
// - No JS, no IntersectionObserver/WAAPI, or prefers-reduced-motion: the attribute is never set, nothing is hidden.
// - If the body script has not started within 3s, the head script removes the attribute and everything shows.
// Elements opt in with data-reveal="up" | "line" and an optional data-reveal-delay in ms.
// The #anchor target (and anything containing it) only fades: a slide would shift it while the browser scrolls to it,
// leaving it ~20px off and partly under the fixed header.

export const revealHeadScript = `(function(){try{var d=document.documentElement;if(!window.IntersectionObserver||!d.animate||matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-js-reveal","");setTimeout(function(){if(!window.__revealReady)d.removeAttribute("data-js-reveal")},3000)}catch(e){}})()`;

export const revealBodyScript = `(function(){var d=document.documentElement;try{if(!d.hasAttribute("data-js-reveal"))return;window.__revealReady=true;var ease="cubic-bezier(.22,1,.36,1)",kinds={up:{frames:[{opacity:0,translate:"0 24px"},{opacity:1,translate:"0 0"}],duration:700},line:{frames:[{transform:"scaleY(0)"},{transform:"scaleY(1)"}],duration:1100}},fade=[{opacity:0},{opacity:1}],target=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;io.unobserve(entry.target);var el=entry.target,kind=kinds[el.getAttribute("data-reveal")]||kinds.up;el.animate(kind===kinds.up&&target&&el.contains(target)?fade:kind.frames,{duration:kind.duration,delay:Number(el.getAttribute("data-reveal-delay"))||0,easing:ease,fill:"both"})})},{rootMargin:"0px 0px -12% 0px"});document.querySelectorAll("[data-reveal]").forEach(function(el){io.observe(el)})}catch(e){d.removeAttribute("data-js-reveal")}})()`;
