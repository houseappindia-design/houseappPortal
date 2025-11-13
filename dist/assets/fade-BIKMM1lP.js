import{a2 as e}from"./button-uiK9lSco.js";import"./index-B1PDI0VP.js";import{Y as r}from"./BaseInput-BmM1wVrK.js";const m=new e("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),s=new e("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),f=function(a){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;const{antCls:o}=a,n=`${o}-fade`,t=i?"&":"";return[r(n,m,s,a.motionDurationMid,i),{[`
        ${t}${n}-enter,
        ${t}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${t}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{f as i};
