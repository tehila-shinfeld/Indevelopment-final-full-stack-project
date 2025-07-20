import{c as d,r as a,j as e,X as _,S as $}from"./index-C1yQ6Jkv.js";/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],z=d("bold",L);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],E=d("italic",H);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M10 12h11",key:"6m4ad9"}],["path",{d:"M10 18h11",key:"11hvi2"}],["path",{d:"M10 6h11",key:"c7qv1k"}],["path",{d:"M4 10h2",key:"16xx2s"}],["path",{d:"M4 6h1v4",key:"cnovpq"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",key:"m9a95d"}]],U=d("list-ordered",I);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]],T=d("list",S);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"M21 7v6h-6",key:"3ptur4"}],["path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",key:"1kgawr"}]],R=d("redo",O);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]],q=d("underline",F);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]],V=d("undo",B),m=u=>{let t=u.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/__(.*?)__/g,"<u>$1</u>");const h=t.split(`
`);let s=!1,c=!1;const l=[];return h.forEach(p=>{const r=p.trim();r.startsWith("- ")?(s||(c&&(l.push("</ol>"),c=!1),l.push("<ul>"),s=!0),l.push(`<li>${r.substring(2)}</li>`)):r.match(/^\d+\. /)?(c||(s&&(l.push("</ul>"),s=!1),l.push("<ol>"),c=!0),l.push(`<li>${r.substring(r.indexOf(".")+1).trim()}</li>`)):(s&&(l.push("</ul>"),s=!1),c&&(l.push("</ol>"),c=!1),l.push(p))}),s&&l.push("</ul>"),c&&l.push("</ol>"),t=l.join(`
`),t=t.replace(/\n(?!<ul|<ol|<\/ul|<\/ol>)/g,"<br/>"),t},W=u=>{let t=u.replace(/<br\s*\/?>/gi,`
`).replace(/<strong>(.*?)<\/strong>/gi,"**$1**").replace(/<em>(.*?)<\/em>/gi,"*$1*").replace(/<u>(.*?)<\/u>/gi,"__$1__");return t=t.replace(/<\/li>\s*<li>/gi,`
- `),t=t.replace(/<li[^>]*>(.*?)<\/li>/gi,"- $1"),t=t.replace(/<\/?ul[^>]*>/gi,`
`),t=t.replace(/<\/?ol[^>]*>/gi,`
`),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t},w=({onSave:u,onCancel:t,initialText:h})=>{const s=a.useRef(null),[c,l]=a.useState(()=>m(h)),[p,r]=a.useState(16);a.useEffect(()=>{const n=m(h);s.current&&s.current.innerHTML!==n&&(s.current.innerHTML=n,l(n))},[h]);const k=a.useCallback(()=>{s.current&&l(s.current.innerHTML)},[]),o=a.useCallback((n,i)=>{var x;document.execCommand(n,!1,i!==void 0?String(i):void 0),s.current&&l(s.current.innerHTML),(x=s.current)==null||x.focus()},[]),j=a.useCallback(()=>o("bold"),[o]),f=a.useCallback(()=>o("italic"),[o]),b=a.useCallback(()=>o("underline"),[o]),g=a.useCallback(()=>o("insertUnorderedList"),[o]),v=a.useCallback(()=>o("insertOrderedList"),[o]),y=a.useCallback(n=>{let i;n<=12?i=1:n<=14?i=2:n<=16?i=3:n<=18?i=4:n<=20?i=5:n<=24?i=6:i=7,o("fontSize",i),r(n)},[o]),N=a.useCallback(()=>o("undo"),[o]),C=a.useCallback(()=>o("redo"),[o]),M=()=>{const n=W(c);u(n)};return e.jsxs("div",{className:"canvas-editor-container",children:[e.jsxs("div",{className:"canvas-toolbar",children:[e.jsxs("div",{className:"toolbar-section text-formatting",children:[e.jsx("button",{className:"format-button",onClick:j,title:"הדגשה (Bold)",children:e.jsx(z,{size:18})}),e.jsx("button",{className:"format-button",onClick:f,title:"הטיה (Italic)",children:e.jsx(E,{size:18})}),e.jsx("button",{className:"format-button",onClick:b,title:"קו תחתון (Underline)",children:e.jsx(q,{size:18})}),e.jsxs("select",{value:p,onChange:n=>y(Number(n.target.value)),className:"font-size-selector",title:"גודל גופן",children:[e.jsx("option",{value:12,children:"12px"}),e.jsx("option",{value:14,children:"14px"}),e.jsx("option",{value:16,children:"16px"}),e.jsx("option",{value:18,children:"18px"}),e.jsx("option",{value:20,children:"20px"}),e.jsx("option",{value:24,children:"24px"}),e.jsx("option",{value:28,children:"28px"}),e.jsx("option",{value:32,children:"32px"})]})]}),e.jsxs("div",{className:"toolbar-section",children:[e.jsx("button",{className:"format-button",onClick:g,title:"רשימה לא ממוינת",children:e.jsx(T,{size:18})}),e.jsx("button",{className:"format-button",onClick:v,title:"רשימה ממוינת",children:e.jsx(U,{size:18})})]}),e.jsxs("div",{className:"toolbar-section",children:[e.jsx("button",{onClick:N,className:"tool-button",title:"בטל (Undo)",children:e.jsx(V,{size:18})}),e.jsx("button",{onClick:C,className:"tool-button",title:"חזור (Redo)",children:e.jsx(R,{size:18})})]}),e.jsxs("div",{className:"toolbar-actions",children:[e.jsxs("button",{onClick:t,className:"cancel-button",children:[e.jsx(_,{size:18}),e.jsx("span",{children:"ביטול"})]}),e.jsxs("button",{onClick:M,className:"save-button",children:[e.jsx($,{size:18}),e.jsx("span",{children:"שמור"})]})]})]}),e.jsx("div",{className:"canvas-container",children:e.jsx("div",{className:"canvas-wrapper",children:e.jsx("div",{ref:s,contentEditable:"true",dangerouslySetInnerHTML:{__html:c},onInput:k,className:"text-editor",dir:"rtl",style:{fontSize:`${p}px`}})})})]})};export{w as default};
