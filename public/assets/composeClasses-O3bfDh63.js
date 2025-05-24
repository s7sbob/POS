function l(f,c,o=void 0){const u={};for(const i in f){const r=f[i];let n="";for(let e=0;e<r.length;e+=1){const t=r[e];t&&(n+=c(t)+" ",o&&o[t]&&(n+=o[t]+" "))}u[i]=n}return u}export{l as c};
