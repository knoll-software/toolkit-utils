import kg, { useState as js, useEffect as Ks } from "react";
const po = "-", qg = (l) => {
  const h = Kg(l), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: g
  } = l;
  return {
    getClassGroupId: (E) => {
      const A = E.split(po);
      return A[0] === "" && A.length !== 1 && A.shift(), nf(A, h) || Yg(E);
    },
    getConflictingClassGroupIds: (E, A) => {
      const S = o[E] || [];
      return A && g[E] ? [...S, ...g[E]] : S;
    }
  };
}, nf = (l, h) => {
  var E;
  if (l.length === 0)
    return h.classGroupId;
  const o = l[0], g = h.nextPart.get(o), x = g ? nf(l.slice(1), g) : void 0;
  if (x)
    return x;
  if (h.validators.length === 0)
    return;
  const m = l.join(po);
  return (E = h.validators.find(({
    validator: A
  }) => A(m))) == null ? void 0 : E.classGroupId;
}, Zs = /^\[(.+)\]$/, Yg = (l) => {
  if (Zs.test(l)) {
    const h = Zs.exec(l)[1], o = h == null ? void 0 : h.substring(0, h.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, Kg = (l) => {
  const {
    theme: h,
    prefix: o
  } = l, g = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Xg(Object.entries(l.classGroups), o).forEach(([m, E]) => {
    ao(E, g, m, h);
  }), g;
}, ao = (l, h, o, g) => {
  l.forEach((x) => {
    if (typeof x == "string") {
      const m = x === "" ? h : Xs(h, x);
      m.classGroupId = o;
      return;
    }
    if (typeof x == "function") {
      if (Zg(x)) {
        ao(x(g), h, o, g);
        return;
      }
      h.validators.push({
        validator: x,
        classGroupId: o
      });
      return;
    }
    Object.entries(x).forEach(([m, E]) => {
      ao(E, Xs(h, m), o, g);
    });
  });
}, Xs = (l, h) => {
  let o = l;
  return h.split(po).forEach((g) => {
    o.nextPart.has(g) || o.nextPart.set(g, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(g);
  }), o;
}, Zg = (l) => l.isThemeGetter, Xg = (l, h) => h ? l.map(([o, g]) => {
  const x = g.map((m) => typeof m == "string" ? h + m : typeof m == "object" ? Object.fromEntries(Object.entries(m).map(([E, A]) => [h + E, A])) : m);
  return [o, x];
}) : l, Jg = (l) => {
  if (l < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let h = 0, o = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  const x = (m, E) => {
    o.set(m, E), h++, h > l && (h = 0, g = o, o = /* @__PURE__ */ new Map());
  };
  return {
    get(m) {
      let E = o.get(m);
      if (E !== void 0)
        return E;
      if ((E = g.get(m)) !== void 0)
        return x(m, E), E;
    },
    set(m, E) {
      o.has(m) ? o.set(m, E) : x(m, E);
    }
  };
}, ef = "!", Vg = (l) => {
  const {
    separator: h,
    experimentalParseClassName: o
  } = l, g = h.length === 1, x = h[0], m = h.length, E = (A) => {
    const S = [];
    let U = 0, L = 0, $;
    for (let B = 0; B < A.length; B++) {
      let nn = A[B];
      if (U === 0) {
        if (nn === x && (g || A.slice(B, B + m) === h)) {
          S.push(A.slice(L, B)), L = B + m;
          continue;
        }
        if (nn === "/") {
          $ = B;
          continue;
        }
      }
      nn === "[" ? U++ : nn === "]" && U--;
    }
    const M = S.length === 0 ? A : A.substring(L), V = M.startsWith(ef), Z = V ? M.substring(1) : M, Y = $ && $ > L ? $ - L : void 0;
    return {
      modifiers: S,
      hasImportantModifier: V,
      baseClassName: Z,
      maybePostfixModifierPosition: Y
    };
  };
  return o ? (A) => o({
    className: A,
    parseClassName: E
  }) : E;
}, Qg = (l) => {
  if (l.length <= 1)
    return l;
  const h = [];
  let o = [];
  return l.forEach((g) => {
    g[0] === "[" ? (h.push(...o.sort(), g), o = []) : o.push(g);
  }), h.push(...o.sort()), h;
}, jg = (l) => ({
  cache: Jg(l.cacheSize),
  parseClassName: Vg(l),
  ...qg(l)
}), nv = /\s+/, ev = (l, h) => {
  const {
    parseClassName: o,
    getClassGroupId: g,
    getConflictingClassGroupIds: x
  } = h, m = [], E = l.trim().split(nv);
  let A = "";
  for (let S = E.length - 1; S >= 0; S -= 1) {
    const U = E[S], {
      modifiers: L,
      hasImportantModifier: $,
      baseClassName: M,
      maybePostfixModifierPosition: V
    } = o(U);
    let Z = !!V, Y = g(Z ? M.substring(0, V) : M);
    if (!Y) {
      if (!Z) {
        A = U + (A.length > 0 ? " " + A : A);
        continue;
      }
      if (Y = g(M), !Y) {
        A = U + (A.length > 0 ? " " + A : A);
        continue;
      }
      Z = !1;
    }
    const B = Qg(L).join(":"), nn = $ ? B + ef : B, _n = nn + Y;
    if (m.includes(_n))
      continue;
    m.push(_n);
    const yn = x(Y, Z);
    for (let En = 0; En < yn.length; ++En) {
      const Cn = yn[En];
      m.push(nn + Cn);
    }
    A = U + (A.length > 0 ? " " + A : A);
  }
  return A;
};
function tv() {
  let l = 0, h, o, g = "";
  for (; l < arguments.length; )
    (h = arguments[l++]) && (o = tf(h)) && (g && (g += " "), g += o);
  return g;
}
const tf = (l) => {
  if (typeof l == "string")
    return l;
  let h, o = "";
  for (let g = 0; g < l.length; g++)
    l[g] && (h = tf(l[g])) && (o && (o += " "), o += h);
  return o;
};
function rv(l, ...h) {
  let o, g, x, m = E;
  function E(S) {
    const U = h.reduce((L, $) => $(L), l());
    return o = jg(U), g = o.cache.get, x = o.cache.set, m = A, A(S);
  }
  function A(S) {
    const U = g(S);
    if (U)
      return U;
    const L = ev(S, o);
    return x(S, L), L;
  }
  return function() {
    return m(tv.apply(null, arguments));
  };
}
const an = (l) => {
  const h = (o) => o[l] || [];
  return h.isThemeGetter = !0, h;
}, rf = /^\[(?:([a-z-]+):)?(.+)\]$/i, iv = /^\d+\/\d+$/, ov = /* @__PURE__ */ new Set(["px", "full", "screen"]), uv = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, sv = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, fv = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, lv = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, av = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Pe = (l) => Ct(l) || ov.has(l) || iv.test(l), Ve = (l) => Rt(l, "length", mv), Ct = (l) => !!l && !Number.isNaN(Number(l)), fo = (l) => Rt(l, "number", Ct), Kt = (l) => !!l && Number.isInteger(Number(l)), cv = (l) => l.endsWith("%") && Ct(l.slice(0, -1)), H = (l) => rf.test(l), Qe = (l) => uv.test(l), hv = /* @__PURE__ */ new Set(["length", "size", "percentage"]), dv = (l) => Rt(l, hv, of), pv = (l) => Rt(l, "position", of), gv = /* @__PURE__ */ new Set(["image", "url"]), vv = (l) => Rt(l, gv, bv), _v = (l) => Rt(l, "", wv), Zt = () => !0, Rt = (l, h, o) => {
  const g = rf.exec(l);
  return g ? g[1] ? typeof h == "string" ? g[1] === h : h.has(g[1]) : o(g[2]) : !1;
}, mv = (l) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  sv.test(l) && !fv.test(l)
), of = () => !1, wv = (l) => lv.test(l), bv = (l) => av.test(l), xv = () => {
  const l = an("colors"), h = an("spacing"), o = an("blur"), g = an("brightness"), x = an("borderColor"), m = an("borderRadius"), E = an("borderSpacing"), A = an("borderWidth"), S = an("contrast"), U = an("grayscale"), L = an("hueRotate"), $ = an("invert"), M = an("gap"), V = an("gradientColorStops"), Z = an("gradientColorStopPositions"), Y = an("inset"), B = an("margin"), nn = an("opacity"), _n = an("padding"), yn = an("saturate"), En = an("scale"), Cn = an("sepia"), Kn = an("skew"), On = an("space"), oe = an("translate"), he = () => ["auto", "contain", "none"], Me = () => ["auto", "hidden", "clip", "visible", "scroll"], we = () => ["auto", H, h], en = () => [H, h], Ne = () => ["", Pe, Ve], ue = () => ["auto", Ct, H], We = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], $e = () => ["solid", "dashed", "dotted", "double", "none"], de = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Zn = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], Ln = () => ["", "0", H], pe = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], on = () => [Ct, H];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Zt],
      spacing: [Pe, Ve],
      blur: ["none", "", Qe, H],
      brightness: on(),
      borderColor: [l],
      borderRadius: ["none", "", "full", Qe, H],
      borderSpacing: en(),
      borderWidth: Ne(),
      contrast: on(),
      grayscale: Ln(),
      hueRotate: on(),
      invert: Ln(),
      gap: en(),
      gradientColorStops: [l],
      gradientColorStopPositions: [cv, Ve],
      inset: we(),
      margin: we(),
      opacity: on(),
      padding: en(),
      saturate: on(),
      scale: on(),
      sepia: Ln(),
      skew: on(),
      space: en(),
      translate: en()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", H]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [Qe]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": pe()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": pe()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...We(), H]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Me()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Me()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Me()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: he()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": he()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": he()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [Y]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [Y]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [Y]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [Y]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [Y]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [Y]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [Y]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [Y]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [Y]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", Kt, H]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: we()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", H]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: Ln()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: Ln()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Kt, H]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Zt]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Kt, H]
        }, H]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ue()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ue()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Zt]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Kt, H]
        }, H]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ue()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ue()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", H]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", H]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [M]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [M]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [M]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...Zn()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Zn(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...Zn(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [_n]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [_n]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [_n]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [_n]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [_n]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [_n]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [_n]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [_n]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [_n]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [B]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [B]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [B]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [B]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [B]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [B]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [B]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [B]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [B]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [On]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [On]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", H, h]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [H, h, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [H, h, "none", "full", "min", "max", "fit", "prose", {
          screen: [Qe]
        }, Qe]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [H, h, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [H, h, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [H, h, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [H, h, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Qe, Ve]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", fo]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Zt]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", H]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Ct, fo]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Pe, H]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", H]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", H]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [l]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [nn]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [l]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [nn]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...$e(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Pe, Ve]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Pe, H]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [l]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: en()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", H]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", H]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [nn]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...We(), pv]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", dv]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, vv]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [l]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [Z]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [Z]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [Z]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [V]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [V]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [V]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [m]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [m]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [m]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [m]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [m]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [m]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [m]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [m]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [m]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [m]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [m]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [m]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [m]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [m]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [m]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [A]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [A]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [A]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [A]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [A]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [A]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [A]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [A]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [A]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [nn]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...$e(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [A]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [A]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [nn]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: $e()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [x]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [x]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [x]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [x]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [x]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [x]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [x]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [x]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [x]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [x]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...$e()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Pe, H]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Pe, Ve]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [l]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: Ne()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [l]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [nn]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Pe, Ve]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [l]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", Qe, _v]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Zt]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [nn]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...de(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": de()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [o]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [g]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [S]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", Qe, H]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [U]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [L]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [$]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [yn]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [Cn]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [o]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [g]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [S]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [U]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [L]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [$]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [nn]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [yn]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [Cn]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [E]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [E]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [E]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", H]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: on()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", H]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: on()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", H]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [En]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [En]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [En]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Kt, H]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [oe]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [oe]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [Kn]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Kn]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", H]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", l]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", H]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [l]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": en()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": en()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": en()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": en()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": en()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": en()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": en()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": en()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": en()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": en()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": en()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": en()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": en()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": en()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": en()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": en()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": en()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": en()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", H]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [l, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Pe, Ve, fo]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [l, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, yv = /* @__PURE__ */ rv(xv);
function uf(l) {
  var h, o, g = "";
  if (typeof l == "string" || typeof l == "number") g += l;
  else if (typeof l == "object") if (Array.isArray(l)) {
    var x = l.length;
    for (h = 0; h < x; h++) l[h] && (o = uf(l[h])) && (g && (g += " "), g += o);
  } else for (o in l) l[o] && (g && (g += " "), g += o);
  return g;
}
function Ev() {
  for (var l, h, o = 0, g = "", x = arguments.length; o < x; o++) (l = arguments[o]) && (h = uf(l)) && (g && (g += " "), g += h);
  return g;
}
const Av = (...l) => yv(Ev(...l)), Tv = (...l) => (h) => {
  for (const o of l)
    if (o != null) {
      if (typeof o == "function") {
        o(h);
        continue;
      }
      o.current = h;
    }
}, Hv = (l, h) => {
  const o = { ...h };
  for (const g in h) {
    const x = l[g], m = h[g];
    /^on[A-Z]/.test(g) && (x && m ? o[g] = (...A) => {
      m(...A), x(...A);
    } : x && (o[g] = x)), g === "ref" ? o[g] = Tv(x, m) : g === "style" ? o[g] = { ...x, ...m } : g === "className" && (o[g] = Av(x, m));
  }
  return { ...l, ...o };
}, kv = (...l) => (h) => {
  l.forEach((o) => {
    typeof o == "function" && o(h);
  });
}, qv = (l, h, o) => {
  const [g, x] = js(l), m = h !== void 0, E = m ? h : g;
  return [E, (S) => {
    m || x(S), o && o(typeof S == "function" ? S(E) : S);
  }];
}, Yv = (l, h = void 0) => {
  const [o, g] = js(() => {
    if (typeof window > "u")
      return h;
    try {
      const m = window.localStorage.getItem(l);
      return m ? JSON.parse(m) : h;
    } catch {
      return h;
    }
  });
  return [o, (m) => {
    try {
      const E = m instanceof Function ? m(o) : m;
      g(E), typeof window < "u" && window.localStorage.setItem(l, JSON.stringify(E));
    } catch {
    }
  }];
};
var Xt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, co = { exports: {} }, Jt = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Js;
function Cv() {
  if (Js) return Jt;
  Js = 1;
  var l = Symbol.for("react.transitional.element"), h = Symbol.for("react.fragment");
  function o(g, x, m) {
    var E = null;
    if (m !== void 0 && (E = "" + m), x.key !== void 0 && (E = "" + x.key), "key" in x) {
      m = {};
      for (var A in x)
        A !== "key" && (m[A] = x[A]);
    } else m = x;
    return x = m.ref, {
      $$typeof: l,
      type: g,
      key: E,
      ref: x !== void 0 ? x : null,
      props: m
    };
  }
  return Jt.Fragment = h, Jt.jsx = o, Jt.jsxs = o, Jt;
}
var Vt = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vs;
function Sv() {
  return Vs || (Vs = 1, process.env.NODE_ENV !== "production" && function() {
    function l(c) {
      if (c == null) return null;
      if (typeof c == "function")
        return c.$$typeof === Zn ? null : c.displayName || c.name || null;
      if (typeof c == "string") return c;
      switch (c) {
        case Kn:
          return "Fragment";
        case Cn:
          return "Portal";
        case oe:
          return "Profiler";
        case On:
          return "StrictMode";
        case en:
          return "Suspense";
        case Ne:
          return "SuspenseList";
      }
      if (typeof c == "object")
        switch (typeof c.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), c.$$typeof) {
          case Me:
            return (c.displayName || "Context") + ".Provider";
          case he:
            return (c._context.displayName || "Context") + ".Consumer";
          case we:
            var R = c.render;
            return c = c.displayName, c || (c = R.displayName || R.name || "", c = c !== "" ? "ForwardRef(" + c + ")" : "ForwardRef"), c;
          case ue:
            return R = c.displayName || null, R !== null ? R : l(c.type) || "Memo";
          case We:
            R = c._payload, c = c._init;
            try {
              return l(c(R));
            } catch {
            }
        }
      return null;
    }
    function h(c) {
      return "" + c;
    }
    function o(c) {
      try {
        h(c);
        var R = !1;
      } catch {
        R = !0;
      }
      if (R) {
        R = console;
        var I = R.error, Q = typeof Symbol == "function" && Symbol.toStringTag && c[Symbol.toStringTag] || c.constructor.name || "Object";
        return I.call(
          R,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          Q
        ), h(c);
      }
    }
    function g() {
    }
    function x() {
      if (je === 0) {
        be = console.log, nt = console.info, jt = console.warn, Ue = console.error, Fe = console.group, nr = console.groupCollapsed, et = console.groupEnd;
        var c = {
          configurable: !0,
          enumerable: !0,
          value: g,
          writable: !0
        };
        Object.defineProperties(console, {
          info: c,
          log: c,
          warn: c,
          error: c,
          group: c,
          groupCollapsed: c,
          groupEnd: c
        });
      }
      je++;
    }
    function m() {
      if (je--, je === 0) {
        var c = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: on({}, c, { value: be }),
          info: on({}, c, { value: nt }),
          warn: on({}, c, { value: jt }),
          error: on({}, c, { value: Ue }),
          group: on({}, c, { value: Fe }),
          groupCollapsed: on({}, c, { value: nr }),
          groupEnd: on({}, c, { value: et })
        });
      }
      0 > je && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function E(c) {
      if (Be === void 0)
        try {
          throw Error();
        } catch (I) {
          var R = I.stack.trim().match(/\n( *(at )?)/);
          Be = R && R[1] || "", Ot = -1 < I.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < I.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + Be + c + Ot;
    }
    function A(c, R) {
      if (!c || Pn) return "";
      var I = xe.get(c);
      if (I !== void 0) return I;
      Pn = !0, I = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var Q = null;
      Q = Ln.H, Ln.H = null, x();
      try {
        var dn = {
          DetermineComponentFrameRoot: function() {
            try {
              if (R) {
                var Jn = function() {
                  throw Error();
                };
                if (Object.defineProperty(Jn.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Jn, []);
                  } catch (Dn) {
                    var Ge = Dn;
                  }
                  Reflect.construct(c, [], Jn);
                } else {
                  try {
                    Jn.call();
                  } catch (Dn) {
                    Ge = Dn;
                  }
                  c.call(Jn.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (Dn) {
                  Ge = Dn;
                }
                (Jn = c()) && typeof Jn.catch == "function" && Jn.catch(function() {
                });
              }
            } catch (Dn) {
              if (Dn && Ge && typeof Dn.stack == "string")
                return [Dn.stack, Ge.stack];
            }
            return [null, null];
          }
        };
        dn.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var fn = Object.getOwnPropertyDescriptor(
          dn.DetermineComponentFrameRoot,
          "name"
        );
        fn && fn.configurable && Object.defineProperty(
          dn.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var F = dn.DetermineComponentFrameRoot(), Sn = F[0], ge = F[1];
        if (Sn && ge) {
          var mn = Sn.split(`
`), se = ge.split(`
`);
          for (F = fn = 0; fn < mn.length && !mn[fn].includes(
            "DetermineComponentFrameRoot"
          ); )
            fn++;
          for (; F < se.length && !se[F].includes(
            "DetermineComponentFrameRoot"
          ); )
            F++;
          if (fn === mn.length || F === se.length)
            for (fn = mn.length - 1, F = se.length - 1; 1 <= fn && 0 <= F && mn[fn] !== se[F]; )
              F--;
          for (; 1 <= fn && 0 <= F; fn--, F--)
            if (mn[fn] !== se[F]) {
              if (fn !== 1 || F !== 1)
                do
                  if (fn--, F--, 0 > F || mn[fn] !== se[F]) {
                    var ye = `
` + mn[fn].replace(
                      " at new ",
                      " at "
                    );
                    return c.displayName && ye.includes("<anonymous>") && (ye = ye.replace("<anonymous>", c.displayName)), typeof c == "function" && xe.set(c, ye), ye;
                  }
                while (1 <= fn && 0 <= F);
              break;
            }
        }
      } finally {
        Pn = !1, Ln.H = Q, m(), Error.prepareStackTrace = I;
      }
      return mn = (mn = c ? c.displayName || c.name : "") ? E(mn) : "", typeof c == "function" && xe.set(c, mn), mn;
    }
    function S(c) {
      if (c == null) return "";
      if (typeof c == "function") {
        var R = c.prototype;
        return A(
          c,
          !(!R || !R.isReactComponent)
        );
      }
      if (typeof c == "string") return E(c);
      switch (c) {
        case en:
          return E("Suspense");
        case Ne:
          return E("SuspenseList");
      }
      if (typeof c == "object")
        switch (c.$$typeof) {
          case we:
            return c = A(c.render, !1), c;
          case ue:
            return S(c.type);
          case We:
            R = c._payload, c = c._init;
            try {
              return S(c(R));
            } catch {
            }
        }
      return "";
    }
    function U() {
      var c = Ln.A;
      return c === null ? null : c.getOwner();
    }
    function L(c) {
      if (pe.call(c, "key")) {
        var R = Object.getOwnPropertyDescriptor(c, "key").get;
        if (R && R.isReactWarning) return !1;
      }
      return c.key !== void 0;
    }
    function $(c, R) {
      function I() {
        Xn || (Xn = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          R
        ));
      }
      I.isReactWarning = !0, Object.defineProperty(c, "key", {
        get: I,
        configurable: !0
      });
    }
    function M() {
      var c = l(this.type);
      return Lt[c] || (Lt[c] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), c = this.props.ref, c !== void 0 ? c : null;
    }
    function V(c, R, I, Q, dn, fn) {
      return I = fn.ref, c = {
        $$typeof: En,
        type: c,
        key: R,
        props: fn,
        _owner: dn
      }, (I !== void 0 ? I : null) !== null ? Object.defineProperty(c, "ref", {
        enumerable: !1,
        get: M
      }) : Object.defineProperty(c, "ref", { enumerable: !1, value: null }), c._store = {}, Object.defineProperty(c._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(c, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(c.props), Object.freeze(c)), c;
    }
    function Z(c, R, I, Q, dn, fn) {
      if (typeof c == "string" || typeof c == "function" || c === Kn || c === oe || c === On || c === en || c === Ne || c === $e || typeof c == "object" && c !== null && (c.$$typeof === We || c.$$typeof === ue || c.$$typeof === Me || c.$$typeof === he || c.$$typeof === we || c.$$typeof === Yr || c.getModuleId !== void 0)) {
        var F = R.children;
        if (F !== void 0)
          if (Q)
            if (It(F)) {
              for (Q = 0; Q < F.length; Q++)
                Y(F[Q], c);
              Object.freeze && Object.freeze(F);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else Y(F, c);
      } else
        F = "", (c === void 0 || typeof c == "object" && c !== null && Object.keys(c).length === 0) && (F += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), c === null ? Q = "null" : It(c) ? Q = "array" : c !== void 0 && c.$$typeof === En ? (Q = "<" + (l(c.type) || "Unknown") + " />", F = " Did you accidentally export a JSX literal instead of a component?") : Q = typeof c, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          Q,
          F
        );
      if (pe.call(R, "key")) {
        F = l(c);
        var Sn = Object.keys(R).filter(function(mn) {
          return mn !== "key";
        });
        Q = 0 < Sn.length ? "{key: someKey, " + Sn.join(": ..., ") + ": ...}" : "{key: someKey}", er[F + Q] || (Sn = 0 < Sn.length ? "{" + Sn.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          Q,
          F,
          Sn,
          F
        ), er[F + Q] = !0);
      }
      if (F = null, I !== void 0 && (o(I), F = "" + I), L(R) && (o(R.key), F = "" + R.key), "key" in R) {
        I = {};
        for (var ge in R)
          ge !== "key" && (I[ge] = R[ge]);
      } else I = R;
      return F && $(
        I,
        typeof c == "function" ? c.displayName || c.name || "Unknown" : c
      ), V(c, F, fn, dn, U(), I);
    }
    function Y(c, R) {
      if (typeof c == "object" && c && c.$$typeof !== Kr) {
        if (It(c))
          for (var I = 0; I < c.length; I++) {
            var Q = c[I];
            B(Q) && nn(Q, R);
          }
        else if (B(c))
          c._store && (c._store.validated = 1);
        else if (c === null || typeof c != "object" ? I = null : (I = de && c[de] || c["@@iterator"], I = typeof I == "function" ? I : null), typeof I == "function" && I !== c.entries && (I = I.call(c), I !== c))
          for (; !(c = I.next()).done; )
            B(c.value) && nn(c.value, R);
      }
    }
    function B(c) {
      return typeof c == "object" && c !== null && c.$$typeof === En;
    }
    function nn(c, R) {
      if (c._store && !c._store.validated && c.key == null && (c._store.validated = 1, R = _n(R), !De[R])) {
        De[R] = !0;
        var I = "";
        c && c._owner != null && c._owner !== U() && (I = null, typeof c._owner.tag == "number" ? I = l(c._owner.type) : typeof c._owner.name == "string" && (I = c._owner.name), I = " It was passed a child from " + I + ".");
        var Q = Ln.getCurrentStack;
        Ln.getCurrentStack = function() {
          var dn = S(c.type);
          return Q && (dn += Q() || ""), dn;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          R,
          I
        ), Ln.getCurrentStack = Q;
      }
    }
    function _n(c) {
      var R = "", I = U();
      return I && (I = l(I.type)) && (R = `

Check the render method of \`` + I + "`."), R || (c = l(c)) && (R = `

Check the top-level render call using <` + c + ">."), R;
    }
    var yn = kg, En = Symbol.for("react.transitional.element"), Cn = Symbol.for("react.portal"), Kn = Symbol.for("react.fragment"), On = Symbol.for("react.strict_mode"), oe = Symbol.for("react.profiler"), he = Symbol.for("react.consumer"), Me = Symbol.for("react.context"), we = Symbol.for("react.forward_ref"), en = Symbol.for("react.suspense"), Ne = Symbol.for("react.suspense_list"), ue = Symbol.for("react.memo"), We = Symbol.for("react.lazy"), $e = Symbol.for("react.offscreen"), de = Symbol.iterator, Zn = Symbol.for("react.client.reference"), Ln = yn.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, pe = Object.prototype.hasOwnProperty, on = Object.assign, Yr = Symbol.for("react.client.reference"), It = Array.isArray, je = 0, be, nt, jt, Ue, Fe, nr, et;
    g.__reactDisabledLog = !0;
    var Be, Ot, Pn = !1, xe = new (typeof WeakMap == "function" ? WeakMap : Map)(), Kr = Symbol.for("react.client.reference"), Xn, Lt = {}, er = {}, De = {};
    Vt.Fragment = Kn, Vt.jsx = function(c, R, I, Q, dn) {
      return Z(c, R, I, !1, Q, dn);
    }, Vt.jsxs = function(c, R, I, Q, dn) {
      return Z(c, R, I, !0, Q, dn);
    };
  }()), Vt;
}
process.env.NODE_ENV === "production" ? co.exports = Cv() : co.exports = Sv();
var ho = co.exports, kr = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
kr.exports;
(function(l, h) {
  (function() {
    var o, g = "4.17.21", x = 200, m = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", E = "Expected a function", A = "Invalid `variable` option passed into `_.template`", S = "__lodash_hash_undefined__", U = 500, L = "__lodash_placeholder__", $ = 1, M = 2, V = 4, Z = 1, Y = 2, B = 1, nn = 2, _n = 4, yn = 8, En = 16, Cn = 32, Kn = 64, On = 128, oe = 256, he = 512, Me = 30, we = "...", en = 800, Ne = 16, ue = 1, We = 2, $e = 3, de = 1 / 0, Zn = 9007199254740991, Ln = 17976931348623157e292, pe = NaN, on = 4294967295, Yr = on - 1, It = on >>> 1, je = [
      ["ary", On],
      ["bind", B],
      ["bindKey", nn],
      ["curry", yn],
      ["curryRight", En],
      ["flip", he],
      ["partial", Cn],
      ["partialRight", Kn],
      ["rearg", oe]
    ], be = "[object Arguments]", nt = "[object Array]", jt = "[object AsyncFunction]", Ue = "[object Boolean]", Fe = "[object Date]", nr = "[object DOMException]", et = "[object Error]", Be = "[object Function]", Ot = "[object GeneratorFunction]", Pn = "[object Map]", xe = "[object Number]", Kr = "[object Null]", Xn = "[object Object]", Lt = "[object Promise]", er = "[object Proxy]", De = "[object RegExp]", c = "[object Set]", R = "[object String]", I = "[object Symbol]", Q = "[object Undefined]", dn = "[object WeakMap]", fn = "[object WeakSet]", F = "[object ArrayBuffer]", Sn = "[object DataView]", ge = "[object Float32Array]", mn = "[object Float64Array]", se = "[object Int8Array]", ye = "[object Int16Array]", Jn = "[object Int32Array]", Ge = "[object Uint8Array]", Dn = "[object Uint8ClampedArray]", Zr = "[object Uint16Array]", Xr = "[object Uint32Array]", cf = /\b__p \+= '';/g, hf = /\b(__p \+=) '' \+/g, df = /(__e\(.*?\)|\b__t\)) \+\n'';/g, mo = /&(?:amp|lt|gt|quot|#39);/g, wo = /[&<>"']/g, pf = RegExp(mo.source), gf = RegExp(wo.source), vf = /<%-([\s\S]+?)%>/g, _f = /<%([\s\S]+?)%>/g, bo = /<%=([\s\S]+?)%>/g, mf = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, wf = /^\w*$/, bf = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Jr = /[\\^$.*+?()[\]{}|]/g, xf = RegExp(Jr.source), Vr = /^\s+/, yf = /\s/, Ef = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Af = /\{\n\/\* \[wrapped with (.+)\] \*/, Tf = /,? & /, Cf = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Sf = /[()=,{}\[\]\/\s]/, Rf = /\\(\\)?/g, If = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, xo = /\w*$/, Of = /^[-+]0x[0-9a-f]+$/i, Lf = /^0b[01]+$/i, Pf = /^\[object .+?Constructor\]$/, Mf = /^0o[0-7]+$/i, Nf = /^(?:0|[1-9]\d*)$/, Wf = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, tr = /($^)/, $f = /['\n\r\u2028\u2029\\]/g, rr = "\\ud800-\\udfff", Uf = "\\u0300-\\u036f", Ff = "\\ufe20-\\ufe2f", Bf = "\\u20d0-\\u20ff", yo = Uf + Ff + Bf, Eo = "\\u2700-\\u27bf", Ao = "a-z\\xdf-\\xf6\\xf8-\\xff", Df = "\\xac\\xb1\\xd7\\xf7", Gf = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", zf = "\\u2000-\\u206f", Hf = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", To = "A-Z\\xc0-\\xd6\\xd8-\\xde", Co = "\\ufe0e\\ufe0f", So = Df + Gf + zf + Hf, Qr = "['’]", kf = "[" + rr + "]", Ro = "[" + So + "]", ir = "[" + yo + "]", Io = "\\d+", qf = "[" + Eo + "]", Oo = "[" + Ao + "]", Lo = "[^" + rr + So + Io + Eo + Ao + To + "]", jr = "\\ud83c[\\udffb-\\udfff]", Yf = "(?:" + ir + "|" + jr + ")", Po = "[^" + rr + "]", ni = "(?:\\ud83c[\\udde6-\\uddff]){2}", ei = "[\\ud800-\\udbff][\\udc00-\\udfff]", ht = "[" + To + "]", Mo = "\\u200d", No = "(?:" + Oo + "|" + Lo + ")", Kf = "(?:" + ht + "|" + Lo + ")", Wo = "(?:" + Qr + "(?:d|ll|m|re|s|t|ve))?", $o = "(?:" + Qr + "(?:D|LL|M|RE|S|T|VE))?", Uo = Yf + "?", Fo = "[" + Co + "]?", Zf = "(?:" + Mo + "(?:" + [Po, ni, ei].join("|") + ")" + Fo + Uo + ")*", Xf = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Jf = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Bo = Fo + Uo + Zf, Vf = "(?:" + [qf, ni, ei].join("|") + ")" + Bo, Qf = "(?:" + [Po + ir + "?", ir, ni, ei, kf].join("|") + ")", jf = RegExp(Qr, "g"), nl = RegExp(ir, "g"), ti = RegExp(jr + "(?=" + jr + ")|" + Qf + Bo, "g"), el = RegExp([
      ht + "?" + Oo + "+" + Wo + "(?=" + [Ro, ht, "$"].join("|") + ")",
      Kf + "+" + $o + "(?=" + [Ro, ht + No, "$"].join("|") + ")",
      ht + "?" + No + "+" + Wo,
      ht + "+" + $o,
      Jf,
      Xf,
      Io,
      Vf
    ].join("|"), "g"), tl = RegExp("[" + Mo + rr + yo + Co + "]"), rl = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, il = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], ol = -1, ln = {};
    ln[ge] = ln[mn] = ln[se] = ln[ye] = ln[Jn] = ln[Ge] = ln[Dn] = ln[Zr] = ln[Xr] = !0, ln[be] = ln[nt] = ln[F] = ln[Ue] = ln[Sn] = ln[Fe] = ln[et] = ln[Be] = ln[Pn] = ln[xe] = ln[Xn] = ln[De] = ln[c] = ln[R] = ln[dn] = !1;
    var sn = {};
    sn[be] = sn[nt] = sn[F] = sn[Sn] = sn[Ue] = sn[Fe] = sn[ge] = sn[mn] = sn[se] = sn[ye] = sn[Jn] = sn[Pn] = sn[xe] = sn[Xn] = sn[De] = sn[c] = sn[R] = sn[I] = sn[Ge] = sn[Dn] = sn[Zr] = sn[Xr] = !0, sn[et] = sn[Be] = sn[dn] = !1;
    var ul = {
      // Latin-1 Supplement block.
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      // Latin Extended-A block.
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s"
    }, sl = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, fl = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, ll = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, al = parseFloat, cl = parseInt, Do = typeof Xt == "object" && Xt && Xt.Object === Object && Xt, hl = typeof self == "object" && self && self.Object === Object && self, An = Do || hl || Function("return this")(), ri = h && !h.nodeType && h, tt = ri && !0 && l && !l.nodeType && l, Go = tt && tt.exports === ri, ii = Go && Do.process, Vn = function() {
      try {
        var d = tt && tt.require && tt.require("util").types;
        return d || ii && ii.binding && ii.binding("util");
      } catch {
      }
    }(), zo = Vn && Vn.isArrayBuffer, Ho = Vn && Vn.isDate, ko = Vn && Vn.isMap, qo = Vn && Vn.isRegExp, Yo = Vn && Vn.isSet, Ko = Vn && Vn.isTypedArray;
    function Gn(d, _, v) {
      switch (v.length) {
        case 0:
          return d.call(_);
        case 1:
          return d.call(_, v[0]);
        case 2:
          return d.call(_, v[0], v[1]);
        case 3:
          return d.call(_, v[0], v[1], v[2]);
      }
      return d.apply(_, v);
    }
    function dl(d, _, v, C) {
      for (var D = -1, j = d == null ? 0 : d.length; ++D < j; ) {
        var wn = d[D];
        _(C, wn, v(wn), d);
      }
      return C;
    }
    function Qn(d, _) {
      for (var v = -1, C = d == null ? 0 : d.length; ++v < C && _(d[v], v, d) !== !1; )
        ;
      return d;
    }
    function pl(d, _) {
      for (var v = d == null ? 0 : d.length; v-- && _(d[v], v, d) !== !1; )
        ;
      return d;
    }
    function Zo(d, _) {
      for (var v = -1, C = d == null ? 0 : d.length; ++v < C; )
        if (!_(d[v], v, d))
          return !1;
      return !0;
    }
    function ze(d, _) {
      for (var v = -1, C = d == null ? 0 : d.length, D = 0, j = []; ++v < C; ) {
        var wn = d[v];
        _(wn, v, d) && (j[D++] = wn);
      }
      return j;
    }
    function or(d, _) {
      var v = d == null ? 0 : d.length;
      return !!v && dt(d, _, 0) > -1;
    }
    function oi(d, _, v) {
      for (var C = -1, D = d == null ? 0 : d.length; ++C < D; )
        if (v(_, d[C]))
          return !0;
      return !1;
    }
    function cn(d, _) {
      for (var v = -1, C = d == null ? 0 : d.length, D = Array(C); ++v < C; )
        D[v] = _(d[v], v, d);
      return D;
    }
    function He(d, _) {
      for (var v = -1, C = _.length, D = d.length; ++v < C; )
        d[D + v] = _[v];
      return d;
    }
    function ui(d, _, v, C) {
      var D = -1, j = d == null ? 0 : d.length;
      for (C && j && (v = d[++D]); ++D < j; )
        v = _(v, d[D], D, d);
      return v;
    }
    function gl(d, _, v, C) {
      var D = d == null ? 0 : d.length;
      for (C && D && (v = d[--D]); D--; )
        v = _(v, d[D], D, d);
      return v;
    }
    function si(d, _) {
      for (var v = -1, C = d == null ? 0 : d.length; ++v < C; )
        if (_(d[v], v, d))
          return !0;
      return !1;
    }
    var vl = fi("length");
    function _l(d) {
      return d.split("");
    }
    function ml(d) {
      return d.match(Cf) || [];
    }
    function Xo(d, _, v) {
      var C;
      return v(d, function(D, j, wn) {
        if (_(D, j, wn))
          return C = j, !1;
      }), C;
    }
    function ur(d, _, v, C) {
      for (var D = d.length, j = v + (C ? 1 : -1); C ? j-- : ++j < D; )
        if (_(d[j], j, d))
          return j;
      return -1;
    }
    function dt(d, _, v) {
      return _ === _ ? Ol(d, _, v) : ur(d, Jo, v);
    }
    function wl(d, _, v, C) {
      for (var D = v - 1, j = d.length; ++D < j; )
        if (C(d[D], _))
          return D;
      return -1;
    }
    function Jo(d) {
      return d !== d;
    }
    function Vo(d, _) {
      var v = d == null ? 0 : d.length;
      return v ? ai(d, _) / v : pe;
    }
    function fi(d) {
      return function(_) {
        return _ == null ? o : _[d];
      };
    }
    function li(d) {
      return function(_) {
        return d == null ? o : d[_];
      };
    }
    function Qo(d, _, v, C, D) {
      return D(d, function(j, wn, un) {
        v = C ? (C = !1, j) : _(v, j, wn, un);
      }), v;
    }
    function bl(d, _) {
      var v = d.length;
      for (d.sort(_); v--; )
        d[v] = d[v].value;
      return d;
    }
    function ai(d, _) {
      for (var v, C = -1, D = d.length; ++C < D; ) {
        var j = _(d[C]);
        j !== o && (v = v === o ? j : v + j);
      }
      return v;
    }
    function ci(d, _) {
      for (var v = -1, C = Array(d); ++v < d; )
        C[v] = _(v);
      return C;
    }
    function xl(d, _) {
      return cn(_, function(v) {
        return [v, d[v]];
      });
    }
    function jo(d) {
      return d && d.slice(0, ru(d) + 1).replace(Vr, "");
    }
    function zn(d) {
      return function(_) {
        return d(_);
      };
    }
    function hi(d, _) {
      return cn(_, function(v) {
        return d[v];
      });
    }
    function Pt(d, _) {
      return d.has(_);
    }
    function nu(d, _) {
      for (var v = -1, C = d.length; ++v < C && dt(_, d[v], 0) > -1; )
        ;
      return v;
    }
    function eu(d, _) {
      for (var v = d.length; v-- && dt(_, d[v], 0) > -1; )
        ;
      return v;
    }
    function yl(d, _) {
      for (var v = d.length, C = 0; v--; )
        d[v] === _ && ++C;
      return C;
    }
    var El = li(ul), Al = li(sl);
    function Tl(d) {
      return "\\" + ll[d];
    }
    function Cl(d, _) {
      return d == null ? o : d[_];
    }
    function pt(d) {
      return tl.test(d);
    }
    function Sl(d) {
      return rl.test(d);
    }
    function Rl(d) {
      for (var _, v = []; !(_ = d.next()).done; )
        v.push(_.value);
      return v;
    }
    function di(d) {
      var _ = -1, v = Array(d.size);
      return d.forEach(function(C, D) {
        v[++_] = [D, C];
      }), v;
    }
    function tu(d, _) {
      return function(v) {
        return d(_(v));
      };
    }
    function ke(d, _) {
      for (var v = -1, C = d.length, D = 0, j = []; ++v < C; ) {
        var wn = d[v];
        (wn === _ || wn === L) && (d[v] = L, j[D++] = v);
      }
      return j;
    }
    function sr(d) {
      var _ = -1, v = Array(d.size);
      return d.forEach(function(C) {
        v[++_] = C;
      }), v;
    }
    function Il(d) {
      var _ = -1, v = Array(d.size);
      return d.forEach(function(C) {
        v[++_] = [C, C];
      }), v;
    }
    function Ol(d, _, v) {
      for (var C = v - 1, D = d.length; ++C < D; )
        if (d[C] === _)
          return C;
      return -1;
    }
    function Ll(d, _, v) {
      for (var C = v + 1; C--; )
        if (d[C] === _)
          return C;
      return C;
    }
    function gt(d) {
      return pt(d) ? Ml(d) : vl(d);
    }
    function fe(d) {
      return pt(d) ? Nl(d) : _l(d);
    }
    function ru(d) {
      for (var _ = d.length; _-- && yf.test(d.charAt(_)); )
        ;
      return _;
    }
    var Pl = li(fl);
    function Ml(d) {
      for (var _ = ti.lastIndex = 0; ti.test(d); )
        ++_;
      return _;
    }
    function Nl(d) {
      return d.match(ti) || [];
    }
    function Wl(d) {
      return d.match(el) || [];
    }
    var $l = function d(_) {
      _ = _ == null ? An : vt.defaults(An.Object(), _, vt.pick(An, il));
      var v = _.Array, C = _.Date, D = _.Error, j = _.Function, wn = _.Math, un = _.Object, pi = _.RegExp, Ul = _.String, jn = _.TypeError, fr = v.prototype, Fl = j.prototype, _t = un.prototype, lr = _["__core-js_shared__"], ar = Fl.toString, rn = _t.hasOwnProperty, Bl = 0, iu = function() {
        var n = /[^.]+$/.exec(lr && lr.keys && lr.keys.IE_PROTO || "");
        return n ? "Symbol(src)_1." + n : "";
      }(), cr = _t.toString, Dl = ar.call(un), Gl = An._, zl = pi(
        "^" + ar.call(rn).replace(Jr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), hr = Go ? _.Buffer : o, qe = _.Symbol, dr = _.Uint8Array, ou = hr ? hr.allocUnsafe : o, pr = tu(un.getPrototypeOf, un), uu = un.create, su = _t.propertyIsEnumerable, gr = fr.splice, fu = qe ? qe.isConcatSpreadable : o, Mt = qe ? qe.iterator : o, rt = qe ? qe.toStringTag : o, vr = function() {
        try {
          var n = ft(un, "defineProperty");
          return n({}, "", {}), n;
        } catch {
        }
      }(), Hl = _.clearTimeout !== An.clearTimeout && _.clearTimeout, kl = C && C.now !== An.Date.now && C.now, ql = _.setTimeout !== An.setTimeout && _.setTimeout, _r = wn.ceil, mr = wn.floor, gi = un.getOwnPropertySymbols, Yl = hr ? hr.isBuffer : o, lu = _.isFinite, Kl = fr.join, Zl = tu(un.keys, un), bn = wn.max, Rn = wn.min, Xl = C.now, Jl = _.parseInt, au = wn.random, Vl = fr.reverse, vi = ft(_, "DataView"), Nt = ft(_, "Map"), _i = ft(_, "Promise"), mt = ft(_, "Set"), Wt = ft(_, "WeakMap"), $t = ft(un, "create"), wr = Wt && new Wt(), wt = {}, Ql = lt(vi), jl = lt(Nt), na = lt(_i), ea = lt(mt), ta = lt(Wt), br = qe ? qe.prototype : o, Ut = br ? br.valueOf : o, cu = br ? br.toString : o;
      function u(n) {
        if (pn(n) && !G(n) && !(n instanceof X)) {
          if (n instanceof ne)
            return n;
          if (rn.call(n, "__wrapped__"))
            return hs(n);
        }
        return new ne(n);
      }
      var bt = /* @__PURE__ */ function() {
        function n() {
        }
        return function(e) {
          if (!hn(e))
            return {};
          if (uu)
            return uu(e);
          n.prototype = e;
          var t = new n();
          return n.prototype = o, t;
        };
      }();
      function xr() {
      }
      function ne(n, e) {
        this.__wrapped__ = n, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = o;
      }
      u.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: vf,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: _f,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: bo,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: u
        }
      }, u.prototype = xr.prototype, u.prototype.constructor = u, ne.prototype = bt(xr.prototype), ne.prototype.constructor = ne;
      function X(n) {
        this.__wrapped__ = n, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = on, this.__views__ = [];
      }
      function ra() {
        var n = new X(this.__wrapped__);
        return n.__actions__ = $n(this.__actions__), n.__dir__ = this.__dir__, n.__filtered__ = this.__filtered__, n.__iteratees__ = $n(this.__iteratees__), n.__takeCount__ = this.__takeCount__, n.__views__ = $n(this.__views__), n;
      }
      function ia() {
        if (this.__filtered__) {
          var n = new X(this);
          n.__dir__ = -1, n.__filtered__ = !0;
        } else
          n = this.clone(), n.__dir__ *= -1;
        return n;
      }
      function oa() {
        var n = this.__wrapped__.value(), e = this.__dir__, t = G(n), r = e < 0, i = t ? n.length : 0, s = _c(0, i, this.__views__), f = s.start, a = s.end, p = a - f, w = r ? a : f - 1, b = this.__iteratees__, y = b.length, T = 0, O = Rn(p, this.__takeCount__);
        if (!t || !r && i == p && O == p)
          return Wu(n, this.__actions__);
        var N = [];
        n:
          for (; p-- && T < O; ) {
            w += e;
            for (var k = -1, W = n[w]; ++k < y; ) {
              var K = b[k], J = K.iteratee, qn = K.type, Wn = J(W);
              if (qn == We)
                W = Wn;
              else if (!Wn) {
                if (qn == ue)
                  continue n;
                break n;
              }
            }
            N[T++] = W;
          }
        return N;
      }
      X.prototype = bt(xr.prototype), X.prototype.constructor = X;
      function it(n) {
        var e = -1, t = n == null ? 0 : n.length;
        for (this.clear(); ++e < t; ) {
          var r = n[e];
          this.set(r[0], r[1]);
        }
      }
      function ua() {
        this.__data__ = $t ? $t(null) : {}, this.size = 0;
      }
      function sa(n) {
        var e = this.has(n) && delete this.__data__[n];
        return this.size -= e ? 1 : 0, e;
      }
      function fa(n) {
        var e = this.__data__;
        if ($t) {
          var t = e[n];
          return t === S ? o : t;
        }
        return rn.call(e, n) ? e[n] : o;
      }
      function la(n) {
        var e = this.__data__;
        return $t ? e[n] !== o : rn.call(e, n);
      }
      function aa(n, e) {
        var t = this.__data__;
        return this.size += this.has(n) ? 0 : 1, t[n] = $t && e === o ? S : e, this;
      }
      it.prototype.clear = ua, it.prototype.delete = sa, it.prototype.get = fa, it.prototype.has = la, it.prototype.set = aa;
      function Ee(n) {
        var e = -1, t = n == null ? 0 : n.length;
        for (this.clear(); ++e < t; ) {
          var r = n[e];
          this.set(r[0], r[1]);
        }
      }
      function ca() {
        this.__data__ = [], this.size = 0;
      }
      function ha(n) {
        var e = this.__data__, t = yr(e, n);
        if (t < 0)
          return !1;
        var r = e.length - 1;
        return t == r ? e.pop() : gr.call(e, t, 1), --this.size, !0;
      }
      function da(n) {
        var e = this.__data__, t = yr(e, n);
        return t < 0 ? o : e[t][1];
      }
      function pa(n) {
        return yr(this.__data__, n) > -1;
      }
      function ga(n, e) {
        var t = this.__data__, r = yr(t, n);
        return r < 0 ? (++this.size, t.push([n, e])) : t[r][1] = e, this;
      }
      Ee.prototype.clear = ca, Ee.prototype.delete = ha, Ee.prototype.get = da, Ee.prototype.has = pa, Ee.prototype.set = ga;
      function Ae(n) {
        var e = -1, t = n == null ? 0 : n.length;
        for (this.clear(); ++e < t; ) {
          var r = n[e];
          this.set(r[0], r[1]);
        }
      }
      function va() {
        this.size = 0, this.__data__ = {
          hash: new it(),
          map: new (Nt || Ee)(),
          string: new it()
        };
      }
      function _a(n) {
        var e = Nr(this, n).delete(n);
        return this.size -= e ? 1 : 0, e;
      }
      function ma(n) {
        return Nr(this, n).get(n);
      }
      function wa(n) {
        return Nr(this, n).has(n);
      }
      function ba(n, e) {
        var t = Nr(this, n), r = t.size;
        return t.set(n, e), this.size += t.size == r ? 0 : 1, this;
      }
      Ae.prototype.clear = va, Ae.prototype.delete = _a, Ae.prototype.get = ma, Ae.prototype.has = wa, Ae.prototype.set = ba;
      function ot(n) {
        var e = -1, t = n == null ? 0 : n.length;
        for (this.__data__ = new Ae(); ++e < t; )
          this.add(n[e]);
      }
      function xa(n) {
        return this.__data__.set(n, S), this;
      }
      function ya(n) {
        return this.__data__.has(n);
      }
      ot.prototype.add = ot.prototype.push = xa, ot.prototype.has = ya;
      function le(n) {
        var e = this.__data__ = new Ee(n);
        this.size = e.size;
      }
      function Ea() {
        this.__data__ = new Ee(), this.size = 0;
      }
      function Aa(n) {
        var e = this.__data__, t = e.delete(n);
        return this.size = e.size, t;
      }
      function Ta(n) {
        return this.__data__.get(n);
      }
      function Ca(n) {
        return this.__data__.has(n);
      }
      function Sa(n, e) {
        var t = this.__data__;
        if (t instanceof Ee) {
          var r = t.__data__;
          if (!Nt || r.length < x - 1)
            return r.push([n, e]), this.size = ++t.size, this;
          t = this.__data__ = new Ae(r);
        }
        return t.set(n, e), this.size = t.size, this;
      }
      le.prototype.clear = Ea, le.prototype.delete = Aa, le.prototype.get = Ta, le.prototype.has = Ca, le.prototype.set = Sa;
      function hu(n, e) {
        var t = G(n), r = !t && at(n), i = !t && !r && Je(n), s = !t && !r && !i && At(n), f = t || r || i || s, a = f ? ci(n.length, Ul) : [], p = a.length;
        for (var w in n)
          (e || rn.call(n, w)) && !(f && // Safari 9 has enumerable `arguments.length` in strict mode.
          (w == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          i && (w == "offset" || w == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          s && (w == "buffer" || w == "byteLength" || w == "byteOffset") || // Skip index properties.
          Re(w, p))) && a.push(w);
        return a;
      }
      function du(n) {
        var e = n.length;
        return e ? n[Ri(0, e - 1)] : o;
      }
      function Ra(n, e) {
        return Wr($n(n), ut(e, 0, n.length));
      }
      function Ia(n) {
        return Wr($n(n));
      }
      function mi(n, e, t) {
        (t !== o && !ae(n[e], t) || t === o && !(e in n)) && Te(n, e, t);
      }
      function Ft(n, e, t) {
        var r = n[e];
        (!(rn.call(n, e) && ae(r, t)) || t === o && !(e in n)) && Te(n, e, t);
      }
      function yr(n, e) {
        for (var t = n.length; t--; )
          if (ae(n[t][0], e))
            return t;
        return -1;
      }
      function Oa(n, e, t, r) {
        return Ye(n, function(i, s, f) {
          e(r, i, t(i), f);
        }), r;
      }
      function pu(n, e) {
        return n && _e(e, xn(e), n);
      }
      function La(n, e) {
        return n && _e(e, Fn(e), n);
      }
      function Te(n, e, t) {
        e == "__proto__" && vr ? vr(n, e, {
          configurable: !0,
          enumerable: !0,
          value: t,
          writable: !0
        }) : n[e] = t;
      }
      function wi(n, e) {
        for (var t = -1, r = e.length, i = v(r), s = n == null; ++t < r; )
          i[t] = s ? o : ji(n, e[t]);
        return i;
      }
      function ut(n, e, t) {
        return n === n && (t !== o && (n = n <= t ? n : t), e !== o && (n = n >= e ? n : e)), n;
      }
      function ee(n, e, t, r, i, s) {
        var f, a = e & $, p = e & M, w = e & V;
        if (t && (f = i ? t(n, r, i, s) : t(n)), f !== o)
          return f;
        if (!hn(n))
          return n;
        var b = G(n);
        if (b) {
          if (f = wc(n), !a)
            return $n(n, f);
        } else {
          var y = In(n), T = y == Be || y == Ot;
          if (Je(n))
            return Fu(n, a);
          if (y == Xn || y == be || T && !i) {
            if (f = p || T ? {} : rs(n), !a)
              return p ? fc(n, La(f, n)) : sc(n, pu(f, n));
          } else {
            if (!sn[y])
              return i ? n : {};
            f = bc(n, y, a);
          }
        }
        s || (s = new le());
        var O = s.get(n);
        if (O)
          return O;
        s.set(n, f), Ps(n) ? n.forEach(function(W) {
          f.add(ee(W, e, t, W, n, s));
        }) : Os(n) && n.forEach(function(W, K) {
          f.set(K, ee(W, e, t, K, n, s));
        });
        var N = w ? p ? Bi : Fi : p ? Fn : xn, k = b ? o : N(n);
        return Qn(k || n, function(W, K) {
          k && (K = W, W = n[K]), Ft(f, K, ee(W, e, t, K, n, s));
        }), f;
      }
      function Pa(n) {
        var e = xn(n);
        return function(t) {
          return gu(t, n, e);
        };
      }
      function gu(n, e, t) {
        var r = t.length;
        if (n == null)
          return !r;
        for (n = un(n); r--; ) {
          var i = t[r], s = e[i], f = n[i];
          if (f === o && !(i in n) || !s(f))
            return !1;
        }
        return !0;
      }
      function vu(n, e, t) {
        if (typeof n != "function")
          throw new jn(E);
        return qt(function() {
          n.apply(o, t);
        }, e);
      }
      function Bt(n, e, t, r) {
        var i = -1, s = or, f = !0, a = n.length, p = [], w = e.length;
        if (!a)
          return p;
        t && (e = cn(e, zn(t))), r ? (s = oi, f = !1) : e.length >= x && (s = Pt, f = !1, e = new ot(e));
        n:
          for (; ++i < a; ) {
            var b = n[i], y = t == null ? b : t(b);
            if (b = r || b !== 0 ? b : 0, f && y === y) {
              for (var T = w; T--; )
                if (e[T] === y)
                  continue n;
              p.push(b);
            } else s(e, y, r) || p.push(b);
          }
        return p;
      }
      var Ye = Hu(ve), _u = Hu(xi, !0);
      function Ma(n, e) {
        var t = !0;
        return Ye(n, function(r, i, s) {
          return t = !!e(r, i, s), t;
        }), t;
      }
      function Er(n, e, t) {
        for (var r = -1, i = n.length; ++r < i; ) {
          var s = n[r], f = e(s);
          if (f != null && (a === o ? f === f && !kn(f) : t(f, a)))
            var a = f, p = s;
        }
        return p;
      }
      function Na(n, e, t, r) {
        var i = n.length;
        for (t = z(t), t < 0 && (t = -t > i ? 0 : i + t), r = r === o || r > i ? i : z(r), r < 0 && (r += i), r = t > r ? 0 : Ns(r); t < r; )
          n[t++] = e;
        return n;
      }
      function mu(n, e) {
        var t = [];
        return Ye(n, function(r, i, s) {
          e(r, i, s) && t.push(r);
        }), t;
      }
      function Tn(n, e, t, r, i) {
        var s = -1, f = n.length;
        for (t || (t = yc), i || (i = []); ++s < f; ) {
          var a = n[s];
          e > 0 && t(a) ? e > 1 ? Tn(a, e - 1, t, r, i) : He(i, a) : r || (i[i.length] = a);
        }
        return i;
      }
      var bi = ku(), wu = ku(!0);
      function ve(n, e) {
        return n && bi(n, e, xn);
      }
      function xi(n, e) {
        return n && wu(n, e, xn);
      }
      function Ar(n, e) {
        return ze(e, function(t) {
          return Ie(n[t]);
        });
      }
      function st(n, e) {
        e = Ze(e, n);
        for (var t = 0, r = e.length; n != null && t < r; )
          n = n[me(e[t++])];
        return t && t == r ? n : o;
      }
      function bu(n, e, t) {
        var r = e(n);
        return G(n) ? r : He(r, t(n));
      }
      function Mn(n) {
        return n == null ? n === o ? Q : Kr : rt && rt in un(n) ? vc(n) : Ic(n);
      }
      function yi(n, e) {
        return n > e;
      }
      function Wa(n, e) {
        return n != null && rn.call(n, e);
      }
      function $a(n, e) {
        return n != null && e in un(n);
      }
      function Ua(n, e, t) {
        return n >= Rn(e, t) && n < bn(e, t);
      }
      function Ei(n, e, t) {
        for (var r = t ? oi : or, i = n[0].length, s = n.length, f = s, a = v(s), p = 1 / 0, w = []; f--; ) {
          var b = n[f];
          f && e && (b = cn(b, zn(e))), p = Rn(b.length, p), a[f] = !t && (e || i >= 120 && b.length >= 120) ? new ot(f && b) : o;
        }
        b = n[0];
        var y = -1, T = a[0];
        n:
          for (; ++y < i && w.length < p; ) {
            var O = b[y], N = e ? e(O) : O;
            if (O = t || O !== 0 ? O : 0, !(T ? Pt(T, N) : r(w, N, t))) {
              for (f = s; --f; ) {
                var k = a[f];
                if (!(k ? Pt(k, N) : r(n[f], N, t)))
                  continue n;
              }
              T && T.push(N), w.push(O);
            }
          }
        return w;
      }
      function Fa(n, e, t, r) {
        return ve(n, function(i, s, f) {
          e(r, t(i), s, f);
        }), r;
      }
      function Dt(n, e, t) {
        e = Ze(e, n), n = ss(n, e);
        var r = n == null ? n : n[me(re(e))];
        return r == null ? o : Gn(r, n, t);
      }
      function xu(n) {
        return pn(n) && Mn(n) == be;
      }
      function Ba(n) {
        return pn(n) && Mn(n) == F;
      }
      function Da(n) {
        return pn(n) && Mn(n) == Fe;
      }
      function Gt(n, e, t, r, i) {
        return n === e ? !0 : n == null || e == null || !pn(n) && !pn(e) ? n !== n && e !== e : Ga(n, e, t, r, Gt, i);
      }
      function Ga(n, e, t, r, i, s) {
        var f = G(n), a = G(e), p = f ? nt : In(n), w = a ? nt : In(e);
        p = p == be ? Xn : p, w = w == be ? Xn : w;
        var b = p == Xn, y = w == Xn, T = p == w;
        if (T && Je(n)) {
          if (!Je(e))
            return !1;
          f = !0, b = !1;
        }
        if (T && !b)
          return s || (s = new le()), f || At(n) ? ns(n, e, t, r, i, s) : pc(n, e, p, t, r, i, s);
        if (!(t & Z)) {
          var O = b && rn.call(n, "__wrapped__"), N = y && rn.call(e, "__wrapped__");
          if (O || N) {
            var k = O ? n.value() : n, W = N ? e.value() : e;
            return s || (s = new le()), i(k, W, t, r, s);
          }
        }
        return T ? (s || (s = new le()), gc(n, e, t, r, i, s)) : !1;
      }
      function za(n) {
        return pn(n) && In(n) == Pn;
      }
      function Ai(n, e, t, r) {
        var i = t.length, s = i, f = !r;
        if (n == null)
          return !s;
        for (n = un(n); i--; ) {
          var a = t[i];
          if (f && a[2] ? a[1] !== n[a[0]] : !(a[0] in n))
            return !1;
        }
        for (; ++i < s; ) {
          a = t[i];
          var p = a[0], w = n[p], b = a[1];
          if (f && a[2]) {
            if (w === o && !(p in n))
              return !1;
          } else {
            var y = new le();
            if (r)
              var T = r(w, b, p, n, e, y);
            if (!(T === o ? Gt(b, w, Z | Y, r, y) : T))
              return !1;
          }
        }
        return !0;
      }
      function yu(n) {
        if (!hn(n) || Ac(n))
          return !1;
        var e = Ie(n) ? zl : Pf;
        return e.test(lt(n));
      }
      function Ha(n) {
        return pn(n) && Mn(n) == De;
      }
      function ka(n) {
        return pn(n) && In(n) == c;
      }
      function qa(n) {
        return pn(n) && Gr(n.length) && !!ln[Mn(n)];
      }
      function Eu(n) {
        return typeof n == "function" ? n : n == null ? Bn : typeof n == "object" ? G(n) ? Cu(n[0], n[1]) : Tu(n) : qs(n);
      }
      function Ti(n) {
        if (!kt(n))
          return Zl(n);
        var e = [];
        for (var t in un(n))
          rn.call(n, t) && t != "constructor" && e.push(t);
        return e;
      }
      function Ya(n) {
        if (!hn(n))
          return Rc(n);
        var e = kt(n), t = [];
        for (var r in n)
          r == "constructor" && (e || !rn.call(n, r)) || t.push(r);
        return t;
      }
      function Ci(n, e) {
        return n < e;
      }
      function Au(n, e) {
        var t = -1, r = Un(n) ? v(n.length) : [];
        return Ye(n, function(i, s, f) {
          r[++t] = e(i, s, f);
        }), r;
      }
      function Tu(n) {
        var e = Gi(n);
        return e.length == 1 && e[0][2] ? os(e[0][0], e[0][1]) : function(t) {
          return t === n || Ai(t, n, e);
        };
      }
      function Cu(n, e) {
        return Hi(n) && is(e) ? os(me(n), e) : function(t) {
          var r = ji(t, n);
          return r === o && r === e ? no(t, n) : Gt(e, r, Z | Y);
        };
      }
      function Tr(n, e, t, r, i) {
        n !== e && bi(e, function(s, f) {
          if (i || (i = new le()), hn(s))
            Ka(n, e, f, t, Tr, r, i);
          else {
            var a = r ? r(qi(n, f), s, f + "", n, e, i) : o;
            a === o && (a = s), mi(n, f, a);
          }
        }, Fn);
      }
      function Ka(n, e, t, r, i, s, f) {
        var a = qi(n, t), p = qi(e, t), w = f.get(p);
        if (w) {
          mi(n, t, w);
          return;
        }
        var b = s ? s(a, p, t + "", n, e, f) : o, y = b === o;
        if (y) {
          var T = G(p), O = !T && Je(p), N = !T && !O && At(p);
          b = p, T || O || N ? G(a) ? b = a : gn(a) ? b = $n(a) : O ? (y = !1, b = Fu(p, !0)) : N ? (y = !1, b = Bu(p, !0)) : b = [] : Yt(p) || at(p) ? (b = a, at(a) ? b = Ws(a) : (!hn(a) || Ie(a)) && (b = rs(p))) : y = !1;
        }
        y && (f.set(p, b), i(b, p, r, s, f), f.delete(p)), mi(n, t, b);
      }
      function Su(n, e) {
        var t = n.length;
        if (t)
          return e += e < 0 ? t : 0, Re(e, t) ? n[e] : o;
      }
      function Ru(n, e, t) {
        e.length ? e = cn(e, function(s) {
          return G(s) ? function(f) {
            return st(f, s.length === 1 ? s[0] : s);
          } : s;
        }) : e = [Bn];
        var r = -1;
        e = cn(e, zn(P()));
        var i = Au(n, function(s, f, a) {
          var p = cn(e, function(w) {
            return w(s);
          });
          return { criteria: p, index: ++r, value: s };
        });
        return bl(i, function(s, f) {
          return uc(s, f, t);
        });
      }
      function Za(n, e) {
        return Iu(n, e, function(t, r) {
          return no(n, r);
        });
      }
      function Iu(n, e, t) {
        for (var r = -1, i = e.length, s = {}; ++r < i; ) {
          var f = e[r], a = st(n, f);
          t(a, f) && zt(s, Ze(f, n), a);
        }
        return s;
      }
      function Xa(n) {
        return function(e) {
          return st(e, n);
        };
      }
      function Si(n, e, t, r) {
        var i = r ? wl : dt, s = -1, f = e.length, a = n;
        for (n === e && (e = $n(e)), t && (a = cn(n, zn(t))); ++s < f; )
          for (var p = 0, w = e[s], b = t ? t(w) : w; (p = i(a, b, p, r)) > -1; )
            a !== n && gr.call(a, p, 1), gr.call(n, p, 1);
        return n;
      }
      function Ou(n, e) {
        for (var t = n ? e.length : 0, r = t - 1; t--; ) {
          var i = e[t];
          if (t == r || i !== s) {
            var s = i;
            Re(i) ? gr.call(n, i, 1) : Li(n, i);
          }
        }
        return n;
      }
      function Ri(n, e) {
        return n + mr(au() * (e - n + 1));
      }
      function Ja(n, e, t, r) {
        for (var i = -1, s = bn(_r((e - n) / (t || 1)), 0), f = v(s); s--; )
          f[r ? s : ++i] = n, n += t;
        return f;
      }
      function Ii(n, e) {
        var t = "";
        if (!n || e < 1 || e > Zn)
          return t;
        do
          e % 2 && (t += n), e = mr(e / 2), e && (n += n);
        while (e);
        return t;
      }
      function q(n, e) {
        return Yi(us(n, e, Bn), n + "");
      }
      function Va(n) {
        return du(Tt(n));
      }
      function Qa(n, e) {
        var t = Tt(n);
        return Wr(t, ut(e, 0, t.length));
      }
      function zt(n, e, t, r) {
        if (!hn(n))
          return n;
        e = Ze(e, n);
        for (var i = -1, s = e.length, f = s - 1, a = n; a != null && ++i < s; ) {
          var p = me(e[i]), w = t;
          if (p === "__proto__" || p === "constructor" || p === "prototype")
            return n;
          if (i != f) {
            var b = a[p];
            w = r ? r(b, p, a) : o, w === o && (w = hn(b) ? b : Re(e[i + 1]) ? [] : {});
          }
          Ft(a, p, w), a = a[p];
        }
        return n;
      }
      var Lu = wr ? function(n, e) {
        return wr.set(n, e), n;
      } : Bn, ja = vr ? function(n, e) {
        return vr(n, "toString", {
          configurable: !0,
          enumerable: !1,
          value: to(e),
          writable: !0
        });
      } : Bn;
      function nc(n) {
        return Wr(Tt(n));
      }
      function te(n, e, t) {
        var r = -1, i = n.length;
        e < 0 && (e = -e > i ? 0 : i + e), t = t > i ? i : t, t < 0 && (t += i), i = e > t ? 0 : t - e >>> 0, e >>>= 0;
        for (var s = v(i); ++r < i; )
          s[r] = n[r + e];
        return s;
      }
      function ec(n, e) {
        var t;
        return Ye(n, function(r, i, s) {
          return t = e(r, i, s), !t;
        }), !!t;
      }
      function Cr(n, e, t) {
        var r = 0, i = n == null ? r : n.length;
        if (typeof e == "number" && e === e && i <= It) {
          for (; r < i; ) {
            var s = r + i >>> 1, f = n[s];
            f !== null && !kn(f) && (t ? f <= e : f < e) ? r = s + 1 : i = s;
          }
          return i;
        }
        return Oi(n, e, Bn, t);
      }
      function Oi(n, e, t, r) {
        var i = 0, s = n == null ? 0 : n.length;
        if (s === 0)
          return 0;
        e = t(e);
        for (var f = e !== e, a = e === null, p = kn(e), w = e === o; i < s; ) {
          var b = mr((i + s) / 2), y = t(n[b]), T = y !== o, O = y === null, N = y === y, k = kn(y);
          if (f)
            var W = r || N;
          else w ? W = N && (r || T) : a ? W = N && T && (r || !O) : p ? W = N && T && !O && (r || !k) : O || k ? W = !1 : W = r ? y <= e : y < e;
          W ? i = b + 1 : s = b;
        }
        return Rn(s, Yr);
      }
      function Pu(n, e) {
        for (var t = -1, r = n.length, i = 0, s = []; ++t < r; ) {
          var f = n[t], a = e ? e(f) : f;
          if (!t || !ae(a, p)) {
            var p = a;
            s[i++] = f === 0 ? 0 : f;
          }
        }
        return s;
      }
      function Mu(n) {
        return typeof n == "number" ? n : kn(n) ? pe : +n;
      }
      function Hn(n) {
        if (typeof n == "string")
          return n;
        if (G(n))
          return cn(n, Hn) + "";
        if (kn(n))
          return cu ? cu.call(n) : "";
        var e = n + "";
        return e == "0" && 1 / n == -1 / 0 ? "-0" : e;
      }
      function Ke(n, e, t) {
        var r = -1, i = or, s = n.length, f = !0, a = [], p = a;
        if (t)
          f = !1, i = oi;
        else if (s >= x) {
          var w = e ? null : hc(n);
          if (w)
            return sr(w);
          f = !1, i = Pt, p = new ot();
        } else
          p = e ? [] : a;
        n:
          for (; ++r < s; ) {
            var b = n[r], y = e ? e(b) : b;
            if (b = t || b !== 0 ? b : 0, f && y === y) {
              for (var T = p.length; T--; )
                if (p[T] === y)
                  continue n;
              e && p.push(y), a.push(b);
            } else i(p, y, t) || (p !== a && p.push(y), a.push(b));
          }
        return a;
      }
      function Li(n, e) {
        return e = Ze(e, n), n = ss(n, e), n == null || delete n[me(re(e))];
      }
      function Nu(n, e, t, r) {
        return zt(n, e, t(st(n, e)), r);
      }
      function Sr(n, e, t, r) {
        for (var i = n.length, s = r ? i : -1; (r ? s-- : ++s < i) && e(n[s], s, n); )
          ;
        return t ? te(n, r ? 0 : s, r ? s + 1 : i) : te(n, r ? s + 1 : 0, r ? i : s);
      }
      function Wu(n, e) {
        var t = n;
        return t instanceof X && (t = t.value()), ui(e, function(r, i) {
          return i.func.apply(i.thisArg, He([r], i.args));
        }, t);
      }
      function Pi(n, e, t) {
        var r = n.length;
        if (r < 2)
          return r ? Ke(n[0]) : [];
        for (var i = -1, s = v(r); ++i < r; )
          for (var f = n[i], a = -1; ++a < r; )
            a != i && (s[i] = Bt(s[i] || f, n[a], e, t));
        return Ke(Tn(s, 1), e, t);
      }
      function $u(n, e, t) {
        for (var r = -1, i = n.length, s = e.length, f = {}; ++r < i; ) {
          var a = r < s ? e[r] : o;
          t(f, n[r], a);
        }
        return f;
      }
      function Mi(n) {
        return gn(n) ? n : [];
      }
      function Ni(n) {
        return typeof n == "function" ? n : Bn;
      }
      function Ze(n, e) {
        return G(n) ? n : Hi(n, e) ? [n] : cs(tn(n));
      }
      var tc = q;
      function Xe(n, e, t) {
        var r = n.length;
        return t = t === o ? r : t, !e && t >= r ? n : te(n, e, t);
      }
      var Uu = Hl || function(n) {
        return An.clearTimeout(n);
      };
      function Fu(n, e) {
        if (e)
          return n.slice();
        var t = n.length, r = ou ? ou(t) : new n.constructor(t);
        return n.copy(r), r;
      }
      function Wi(n) {
        var e = new n.constructor(n.byteLength);
        return new dr(e).set(new dr(n)), e;
      }
      function rc(n, e) {
        var t = e ? Wi(n.buffer) : n.buffer;
        return new n.constructor(t, n.byteOffset, n.byteLength);
      }
      function ic(n) {
        var e = new n.constructor(n.source, xo.exec(n));
        return e.lastIndex = n.lastIndex, e;
      }
      function oc(n) {
        return Ut ? un(Ut.call(n)) : {};
      }
      function Bu(n, e) {
        var t = e ? Wi(n.buffer) : n.buffer;
        return new n.constructor(t, n.byteOffset, n.length);
      }
      function Du(n, e) {
        if (n !== e) {
          var t = n !== o, r = n === null, i = n === n, s = kn(n), f = e !== o, a = e === null, p = e === e, w = kn(e);
          if (!a && !w && !s && n > e || s && f && p && !a && !w || r && f && p || !t && p || !i)
            return 1;
          if (!r && !s && !w && n < e || w && t && i && !r && !s || a && t && i || !f && i || !p)
            return -1;
        }
        return 0;
      }
      function uc(n, e, t) {
        for (var r = -1, i = n.criteria, s = e.criteria, f = i.length, a = t.length; ++r < f; ) {
          var p = Du(i[r], s[r]);
          if (p) {
            if (r >= a)
              return p;
            var w = t[r];
            return p * (w == "desc" ? -1 : 1);
          }
        }
        return n.index - e.index;
      }
      function Gu(n, e, t, r) {
        for (var i = -1, s = n.length, f = t.length, a = -1, p = e.length, w = bn(s - f, 0), b = v(p + w), y = !r; ++a < p; )
          b[a] = e[a];
        for (; ++i < f; )
          (y || i < s) && (b[t[i]] = n[i]);
        for (; w--; )
          b[a++] = n[i++];
        return b;
      }
      function zu(n, e, t, r) {
        for (var i = -1, s = n.length, f = -1, a = t.length, p = -1, w = e.length, b = bn(s - a, 0), y = v(b + w), T = !r; ++i < b; )
          y[i] = n[i];
        for (var O = i; ++p < w; )
          y[O + p] = e[p];
        for (; ++f < a; )
          (T || i < s) && (y[O + t[f]] = n[i++]);
        return y;
      }
      function $n(n, e) {
        var t = -1, r = n.length;
        for (e || (e = v(r)); ++t < r; )
          e[t] = n[t];
        return e;
      }
      function _e(n, e, t, r) {
        var i = !t;
        t || (t = {});
        for (var s = -1, f = e.length; ++s < f; ) {
          var a = e[s], p = r ? r(t[a], n[a], a, t, n) : o;
          p === o && (p = n[a]), i ? Te(t, a, p) : Ft(t, a, p);
        }
        return t;
      }
      function sc(n, e) {
        return _e(n, zi(n), e);
      }
      function fc(n, e) {
        return _e(n, es(n), e);
      }
      function Rr(n, e) {
        return function(t, r) {
          var i = G(t) ? dl : Oa, s = e ? e() : {};
          return i(t, n, P(r, 2), s);
        };
      }
      function xt(n) {
        return q(function(e, t) {
          var r = -1, i = t.length, s = i > 1 ? t[i - 1] : o, f = i > 2 ? t[2] : o;
          for (s = n.length > 3 && typeof s == "function" ? (i--, s) : o, f && Nn(t[0], t[1], f) && (s = i < 3 ? o : s, i = 1), e = un(e); ++r < i; ) {
            var a = t[r];
            a && n(e, a, r, s);
          }
          return e;
        });
      }
      function Hu(n, e) {
        return function(t, r) {
          if (t == null)
            return t;
          if (!Un(t))
            return n(t, r);
          for (var i = t.length, s = e ? i : -1, f = un(t); (e ? s-- : ++s < i) && r(f[s], s, f) !== !1; )
            ;
          return t;
        };
      }
      function ku(n) {
        return function(e, t, r) {
          for (var i = -1, s = un(e), f = r(e), a = f.length; a--; ) {
            var p = f[n ? a : ++i];
            if (t(s[p], p, s) === !1)
              break;
          }
          return e;
        };
      }
      function lc(n, e, t) {
        var r = e & B, i = Ht(n);
        function s() {
          var f = this && this !== An && this instanceof s ? i : n;
          return f.apply(r ? t : this, arguments);
        }
        return s;
      }
      function qu(n) {
        return function(e) {
          e = tn(e);
          var t = pt(e) ? fe(e) : o, r = t ? t[0] : e.charAt(0), i = t ? Xe(t, 1).join("") : e.slice(1);
          return r[n]() + i;
        };
      }
      function yt(n) {
        return function(e) {
          return ui(Hs(zs(e).replace(jf, "")), n, "");
        };
      }
      function Ht(n) {
        return function() {
          var e = arguments;
          switch (e.length) {
            case 0:
              return new n();
            case 1:
              return new n(e[0]);
            case 2:
              return new n(e[0], e[1]);
            case 3:
              return new n(e[0], e[1], e[2]);
            case 4:
              return new n(e[0], e[1], e[2], e[3]);
            case 5:
              return new n(e[0], e[1], e[2], e[3], e[4]);
            case 6:
              return new n(e[0], e[1], e[2], e[3], e[4], e[5]);
            case 7:
              return new n(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
          }
          var t = bt(n.prototype), r = n.apply(t, e);
          return hn(r) ? r : t;
        };
      }
      function ac(n, e, t) {
        var r = Ht(n);
        function i() {
          for (var s = arguments.length, f = v(s), a = s, p = Et(i); a--; )
            f[a] = arguments[a];
          var w = s < 3 && f[0] !== p && f[s - 1] !== p ? [] : ke(f, p);
          if (s -= w.length, s < t)
            return Ju(
              n,
              e,
              Ir,
              i.placeholder,
              o,
              f,
              w,
              o,
              o,
              t - s
            );
          var b = this && this !== An && this instanceof i ? r : n;
          return Gn(b, this, f);
        }
        return i;
      }
      function Yu(n) {
        return function(e, t, r) {
          var i = un(e);
          if (!Un(e)) {
            var s = P(t, 3);
            e = xn(e), t = function(a) {
              return s(i[a], a, i);
            };
          }
          var f = n(e, t, r);
          return f > -1 ? i[s ? e[f] : f] : o;
        };
      }
      function Ku(n) {
        return Se(function(e) {
          var t = e.length, r = t, i = ne.prototype.thru;
          for (n && e.reverse(); r--; ) {
            var s = e[r];
            if (typeof s != "function")
              throw new jn(E);
            if (i && !f && Mr(s) == "wrapper")
              var f = new ne([], !0);
          }
          for (r = f ? r : t; ++r < t; ) {
            s = e[r];
            var a = Mr(s), p = a == "wrapper" ? Di(s) : o;
            p && ki(p[0]) && p[1] == (On | yn | Cn | oe) && !p[4].length && p[9] == 1 ? f = f[Mr(p[0])].apply(f, p[3]) : f = s.length == 1 && ki(s) ? f[a]() : f.thru(s);
          }
          return function() {
            var w = arguments, b = w[0];
            if (f && w.length == 1 && G(b))
              return f.plant(b).value();
            for (var y = 0, T = t ? e[y].apply(this, w) : b; ++y < t; )
              T = e[y].call(this, T);
            return T;
          };
        });
      }
      function Ir(n, e, t, r, i, s, f, a, p, w) {
        var b = e & On, y = e & B, T = e & nn, O = e & (yn | En), N = e & he, k = T ? o : Ht(n);
        function W() {
          for (var K = arguments.length, J = v(K), qn = K; qn--; )
            J[qn] = arguments[qn];
          if (O)
            var Wn = Et(W), Yn = yl(J, Wn);
          if (r && (J = Gu(J, r, i, O)), s && (J = zu(J, s, f, O)), K -= Yn, O && K < w) {
            var vn = ke(J, Wn);
            return Ju(
              n,
              e,
              Ir,
              W.placeholder,
              t,
              J,
              vn,
              a,
              p,
              w - K
            );
          }
          var ce = y ? t : this, Le = T ? ce[n] : n;
          return K = J.length, a ? J = Oc(J, a) : N && K > 1 && J.reverse(), b && p < K && (J.length = p), this && this !== An && this instanceof W && (Le = k || Ht(Le)), Le.apply(ce, J);
        }
        return W;
      }
      function Zu(n, e) {
        return function(t, r) {
          return Fa(t, n, e(r), {});
        };
      }
      function Or(n, e) {
        return function(t, r) {
          var i;
          if (t === o && r === o)
            return e;
          if (t !== o && (i = t), r !== o) {
            if (i === o)
              return r;
            typeof t == "string" || typeof r == "string" ? (t = Hn(t), r = Hn(r)) : (t = Mu(t), r = Mu(r)), i = n(t, r);
          }
          return i;
        };
      }
      function $i(n) {
        return Se(function(e) {
          return e = cn(e, zn(P())), q(function(t) {
            var r = this;
            return n(e, function(i) {
              return Gn(i, r, t);
            });
          });
        });
      }
      function Lr(n, e) {
        e = e === o ? " " : Hn(e);
        var t = e.length;
        if (t < 2)
          return t ? Ii(e, n) : e;
        var r = Ii(e, _r(n / gt(e)));
        return pt(e) ? Xe(fe(r), 0, n).join("") : r.slice(0, n);
      }
      function cc(n, e, t, r) {
        var i = e & B, s = Ht(n);
        function f() {
          for (var a = -1, p = arguments.length, w = -1, b = r.length, y = v(b + p), T = this && this !== An && this instanceof f ? s : n; ++w < b; )
            y[w] = r[w];
          for (; p--; )
            y[w++] = arguments[++a];
          return Gn(T, i ? t : this, y);
        }
        return f;
      }
      function Xu(n) {
        return function(e, t, r) {
          return r && typeof r != "number" && Nn(e, t, r) && (t = r = o), e = Oe(e), t === o ? (t = e, e = 0) : t = Oe(t), r = r === o ? e < t ? 1 : -1 : Oe(r), Ja(e, t, r, n);
        };
      }
      function Pr(n) {
        return function(e, t) {
          return typeof e == "string" && typeof t == "string" || (e = ie(e), t = ie(t)), n(e, t);
        };
      }
      function Ju(n, e, t, r, i, s, f, a, p, w) {
        var b = e & yn, y = b ? f : o, T = b ? o : f, O = b ? s : o, N = b ? o : s;
        e |= b ? Cn : Kn, e &= ~(b ? Kn : Cn), e & _n || (e &= -4);
        var k = [
          n,
          e,
          i,
          O,
          y,
          N,
          T,
          a,
          p,
          w
        ], W = t.apply(o, k);
        return ki(n) && fs(W, k), W.placeholder = r, ls(W, n, e);
      }
      function Ui(n) {
        var e = wn[n];
        return function(t, r) {
          if (t = ie(t), r = r == null ? 0 : Rn(z(r), 292), r && lu(t)) {
            var i = (tn(t) + "e").split("e"), s = e(i[0] + "e" + (+i[1] + r));
            return i = (tn(s) + "e").split("e"), +(i[0] + "e" + (+i[1] - r));
          }
          return e(t);
        };
      }
      var hc = mt && 1 / sr(new mt([, -0]))[1] == de ? function(n) {
        return new mt(n);
      } : oo;
      function Vu(n) {
        return function(e) {
          var t = In(e);
          return t == Pn ? di(e) : t == c ? Il(e) : xl(e, n(e));
        };
      }
      function Ce(n, e, t, r, i, s, f, a) {
        var p = e & nn;
        if (!p && typeof n != "function")
          throw new jn(E);
        var w = r ? r.length : 0;
        if (w || (e &= -97, r = i = o), f = f === o ? f : bn(z(f), 0), a = a === o ? a : z(a), w -= i ? i.length : 0, e & Kn) {
          var b = r, y = i;
          r = i = o;
        }
        var T = p ? o : Di(n), O = [
          n,
          e,
          t,
          r,
          i,
          b,
          y,
          s,
          f,
          a
        ];
        if (T && Sc(O, T), n = O[0], e = O[1], t = O[2], r = O[3], i = O[4], a = O[9] = O[9] === o ? p ? 0 : n.length : bn(O[9] - w, 0), !a && e & (yn | En) && (e &= -25), !e || e == B)
          var N = lc(n, e, t);
        else e == yn || e == En ? N = ac(n, e, a) : (e == Cn || e == (B | Cn)) && !i.length ? N = cc(n, e, t, r) : N = Ir.apply(o, O);
        var k = T ? Lu : fs;
        return ls(k(N, O), n, e);
      }
      function Qu(n, e, t, r) {
        return n === o || ae(n, _t[t]) && !rn.call(r, t) ? e : n;
      }
      function ju(n, e, t, r, i, s) {
        return hn(n) && hn(e) && (s.set(e, n), Tr(n, e, o, ju, s), s.delete(e)), n;
      }
      function dc(n) {
        return Yt(n) ? o : n;
      }
      function ns(n, e, t, r, i, s) {
        var f = t & Z, a = n.length, p = e.length;
        if (a != p && !(f && p > a))
          return !1;
        var w = s.get(n), b = s.get(e);
        if (w && b)
          return w == e && b == n;
        var y = -1, T = !0, O = t & Y ? new ot() : o;
        for (s.set(n, e), s.set(e, n); ++y < a; ) {
          var N = n[y], k = e[y];
          if (r)
            var W = f ? r(k, N, y, e, n, s) : r(N, k, y, n, e, s);
          if (W !== o) {
            if (W)
              continue;
            T = !1;
            break;
          }
          if (O) {
            if (!si(e, function(K, J) {
              if (!Pt(O, J) && (N === K || i(N, K, t, r, s)))
                return O.push(J);
            })) {
              T = !1;
              break;
            }
          } else if (!(N === k || i(N, k, t, r, s))) {
            T = !1;
            break;
          }
        }
        return s.delete(n), s.delete(e), T;
      }
      function pc(n, e, t, r, i, s, f) {
        switch (t) {
          case Sn:
            if (n.byteLength != e.byteLength || n.byteOffset != e.byteOffset)
              return !1;
            n = n.buffer, e = e.buffer;
          case F:
            return !(n.byteLength != e.byteLength || !s(new dr(n), new dr(e)));
          case Ue:
          case Fe:
          case xe:
            return ae(+n, +e);
          case et:
            return n.name == e.name && n.message == e.message;
          case De:
          case R:
            return n == e + "";
          case Pn:
            var a = di;
          case c:
            var p = r & Z;
            if (a || (a = sr), n.size != e.size && !p)
              return !1;
            var w = f.get(n);
            if (w)
              return w == e;
            r |= Y, f.set(n, e);
            var b = ns(a(n), a(e), r, i, s, f);
            return f.delete(n), b;
          case I:
            if (Ut)
              return Ut.call(n) == Ut.call(e);
        }
        return !1;
      }
      function gc(n, e, t, r, i, s) {
        var f = t & Z, a = Fi(n), p = a.length, w = Fi(e), b = w.length;
        if (p != b && !f)
          return !1;
        for (var y = p; y--; ) {
          var T = a[y];
          if (!(f ? T in e : rn.call(e, T)))
            return !1;
        }
        var O = s.get(n), N = s.get(e);
        if (O && N)
          return O == e && N == n;
        var k = !0;
        s.set(n, e), s.set(e, n);
        for (var W = f; ++y < p; ) {
          T = a[y];
          var K = n[T], J = e[T];
          if (r)
            var qn = f ? r(J, K, T, e, n, s) : r(K, J, T, n, e, s);
          if (!(qn === o ? K === J || i(K, J, t, r, s) : qn)) {
            k = !1;
            break;
          }
          W || (W = T == "constructor");
        }
        if (k && !W) {
          var Wn = n.constructor, Yn = e.constructor;
          Wn != Yn && "constructor" in n && "constructor" in e && !(typeof Wn == "function" && Wn instanceof Wn && typeof Yn == "function" && Yn instanceof Yn) && (k = !1);
        }
        return s.delete(n), s.delete(e), k;
      }
      function Se(n) {
        return Yi(us(n, o, gs), n + "");
      }
      function Fi(n) {
        return bu(n, xn, zi);
      }
      function Bi(n) {
        return bu(n, Fn, es);
      }
      var Di = wr ? function(n) {
        return wr.get(n);
      } : oo;
      function Mr(n) {
        for (var e = n.name + "", t = wt[e], r = rn.call(wt, e) ? t.length : 0; r--; ) {
          var i = t[r], s = i.func;
          if (s == null || s == n)
            return i.name;
        }
        return e;
      }
      function Et(n) {
        var e = rn.call(u, "placeholder") ? u : n;
        return e.placeholder;
      }
      function P() {
        var n = u.iteratee || ro;
        return n = n === ro ? Eu : n, arguments.length ? n(arguments[0], arguments[1]) : n;
      }
      function Nr(n, e) {
        var t = n.__data__;
        return Ec(e) ? t[typeof e == "string" ? "string" : "hash"] : t.map;
      }
      function Gi(n) {
        for (var e = xn(n), t = e.length; t--; ) {
          var r = e[t], i = n[r];
          e[t] = [r, i, is(i)];
        }
        return e;
      }
      function ft(n, e) {
        var t = Cl(n, e);
        return yu(t) ? t : o;
      }
      function vc(n) {
        var e = rn.call(n, rt), t = n[rt];
        try {
          n[rt] = o;
          var r = !0;
        } catch {
        }
        var i = cr.call(n);
        return r && (e ? n[rt] = t : delete n[rt]), i;
      }
      var zi = gi ? function(n) {
        return n == null ? [] : (n = un(n), ze(gi(n), function(e) {
          return su.call(n, e);
        }));
      } : uo, es = gi ? function(n) {
        for (var e = []; n; )
          He(e, zi(n)), n = pr(n);
        return e;
      } : uo, In = Mn;
      (vi && In(new vi(new ArrayBuffer(1))) != Sn || Nt && In(new Nt()) != Pn || _i && In(_i.resolve()) != Lt || mt && In(new mt()) != c || Wt && In(new Wt()) != dn) && (In = function(n) {
        var e = Mn(n), t = e == Xn ? n.constructor : o, r = t ? lt(t) : "";
        if (r)
          switch (r) {
            case Ql:
              return Sn;
            case jl:
              return Pn;
            case na:
              return Lt;
            case ea:
              return c;
            case ta:
              return dn;
          }
        return e;
      });
      function _c(n, e, t) {
        for (var r = -1, i = t.length; ++r < i; ) {
          var s = t[r], f = s.size;
          switch (s.type) {
            case "drop":
              n += f;
              break;
            case "dropRight":
              e -= f;
              break;
            case "take":
              e = Rn(e, n + f);
              break;
            case "takeRight":
              n = bn(n, e - f);
              break;
          }
        }
        return { start: n, end: e };
      }
      function mc(n) {
        var e = n.match(Af);
        return e ? e[1].split(Tf) : [];
      }
      function ts(n, e, t) {
        e = Ze(e, n);
        for (var r = -1, i = e.length, s = !1; ++r < i; ) {
          var f = me(e[r]);
          if (!(s = n != null && t(n, f)))
            break;
          n = n[f];
        }
        return s || ++r != i ? s : (i = n == null ? 0 : n.length, !!i && Gr(i) && Re(f, i) && (G(n) || at(n)));
      }
      function wc(n) {
        var e = n.length, t = new n.constructor(e);
        return e && typeof n[0] == "string" && rn.call(n, "index") && (t.index = n.index, t.input = n.input), t;
      }
      function rs(n) {
        return typeof n.constructor == "function" && !kt(n) ? bt(pr(n)) : {};
      }
      function bc(n, e, t) {
        var r = n.constructor;
        switch (e) {
          case F:
            return Wi(n);
          case Ue:
          case Fe:
            return new r(+n);
          case Sn:
            return rc(n, t);
          case ge:
          case mn:
          case se:
          case ye:
          case Jn:
          case Ge:
          case Dn:
          case Zr:
          case Xr:
            return Bu(n, t);
          case Pn:
            return new r();
          case xe:
          case R:
            return new r(n);
          case De:
            return ic(n);
          case c:
            return new r();
          case I:
            return oc(n);
        }
      }
      function xc(n, e) {
        var t = e.length;
        if (!t)
          return n;
        var r = t - 1;
        return e[r] = (t > 1 ? "& " : "") + e[r], e = e.join(t > 2 ? ", " : " "), n.replace(Ef, `{
/* [wrapped with ` + e + `] */
`);
      }
      function yc(n) {
        return G(n) || at(n) || !!(fu && n && n[fu]);
      }
      function Re(n, e) {
        var t = typeof n;
        return e = e ?? Zn, !!e && (t == "number" || t != "symbol" && Nf.test(n)) && n > -1 && n % 1 == 0 && n < e;
      }
      function Nn(n, e, t) {
        if (!hn(t))
          return !1;
        var r = typeof e;
        return (r == "number" ? Un(t) && Re(e, t.length) : r == "string" && e in t) ? ae(t[e], n) : !1;
      }
      function Hi(n, e) {
        if (G(n))
          return !1;
        var t = typeof n;
        return t == "number" || t == "symbol" || t == "boolean" || n == null || kn(n) ? !0 : wf.test(n) || !mf.test(n) || e != null && n in un(e);
      }
      function Ec(n) {
        var e = typeof n;
        return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? n !== "__proto__" : n === null;
      }
      function ki(n) {
        var e = Mr(n), t = u[e];
        if (typeof t != "function" || !(e in X.prototype))
          return !1;
        if (n === t)
          return !0;
        var r = Di(t);
        return !!r && n === r[0];
      }
      function Ac(n) {
        return !!iu && iu in n;
      }
      var Tc = lr ? Ie : so;
      function kt(n) {
        var e = n && n.constructor, t = typeof e == "function" && e.prototype || _t;
        return n === t;
      }
      function is(n) {
        return n === n && !hn(n);
      }
      function os(n, e) {
        return function(t) {
          return t == null ? !1 : t[n] === e && (e !== o || n in un(t));
        };
      }
      function Cc(n) {
        var e = Br(n, function(r) {
          return t.size === U && t.clear(), r;
        }), t = e.cache;
        return e;
      }
      function Sc(n, e) {
        var t = n[1], r = e[1], i = t | r, s = i < (B | nn | On), f = r == On && t == yn || r == On && t == oe && n[7].length <= e[8] || r == (On | oe) && e[7].length <= e[8] && t == yn;
        if (!(s || f))
          return n;
        r & B && (n[2] = e[2], i |= t & B ? 0 : _n);
        var a = e[3];
        if (a) {
          var p = n[3];
          n[3] = p ? Gu(p, a, e[4]) : a, n[4] = p ? ke(n[3], L) : e[4];
        }
        return a = e[5], a && (p = n[5], n[5] = p ? zu(p, a, e[6]) : a, n[6] = p ? ke(n[5], L) : e[6]), a = e[7], a && (n[7] = a), r & On && (n[8] = n[8] == null ? e[8] : Rn(n[8], e[8])), n[9] == null && (n[9] = e[9]), n[0] = e[0], n[1] = i, n;
      }
      function Rc(n) {
        var e = [];
        if (n != null)
          for (var t in un(n))
            e.push(t);
        return e;
      }
      function Ic(n) {
        return cr.call(n);
      }
      function us(n, e, t) {
        return e = bn(e === o ? n.length - 1 : e, 0), function() {
          for (var r = arguments, i = -1, s = bn(r.length - e, 0), f = v(s); ++i < s; )
            f[i] = r[e + i];
          i = -1;
          for (var a = v(e + 1); ++i < e; )
            a[i] = r[i];
          return a[e] = t(f), Gn(n, this, a);
        };
      }
      function ss(n, e) {
        return e.length < 2 ? n : st(n, te(e, 0, -1));
      }
      function Oc(n, e) {
        for (var t = n.length, r = Rn(e.length, t), i = $n(n); r--; ) {
          var s = e[r];
          n[r] = Re(s, t) ? i[s] : o;
        }
        return n;
      }
      function qi(n, e) {
        if (!(e === "constructor" && typeof n[e] == "function") && e != "__proto__")
          return n[e];
      }
      var fs = as(Lu), qt = ql || function(n, e) {
        return An.setTimeout(n, e);
      }, Yi = as(ja);
      function ls(n, e, t) {
        var r = e + "";
        return Yi(n, xc(r, Lc(mc(r), t)));
      }
      function as(n) {
        var e = 0, t = 0;
        return function() {
          var r = Xl(), i = Ne - (r - t);
          if (t = r, i > 0) {
            if (++e >= en)
              return arguments[0];
          } else
            e = 0;
          return n.apply(o, arguments);
        };
      }
      function Wr(n, e) {
        var t = -1, r = n.length, i = r - 1;
        for (e = e === o ? r : e; ++t < e; ) {
          var s = Ri(t, i), f = n[s];
          n[s] = n[t], n[t] = f;
        }
        return n.length = e, n;
      }
      var cs = Cc(function(n) {
        var e = [];
        return n.charCodeAt(0) === 46 && e.push(""), n.replace(bf, function(t, r, i, s) {
          e.push(i ? s.replace(Rf, "$1") : r || t);
        }), e;
      });
      function me(n) {
        if (typeof n == "string" || kn(n))
          return n;
        var e = n + "";
        return e == "0" && 1 / n == -1 / 0 ? "-0" : e;
      }
      function lt(n) {
        if (n != null) {
          try {
            return ar.call(n);
          } catch {
          }
          try {
            return n + "";
          } catch {
          }
        }
        return "";
      }
      function Lc(n, e) {
        return Qn(je, function(t) {
          var r = "_." + t[0];
          e & t[1] && !or(n, r) && n.push(r);
        }), n.sort();
      }
      function hs(n) {
        if (n instanceof X)
          return n.clone();
        var e = new ne(n.__wrapped__, n.__chain__);
        return e.__actions__ = $n(n.__actions__), e.__index__ = n.__index__, e.__values__ = n.__values__, e;
      }
      function Pc(n, e, t) {
        (t ? Nn(n, e, t) : e === o) ? e = 1 : e = bn(z(e), 0);
        var r = n == null ? 0 : n.length;
        if (!r || e < 1)
          return [];
        for (var i = 0, s = 0, f = v(_r(r / e)); i < r; )
          f[s++] = te(n, i, i += e);
        return f;
      }
      function Mc(n) {
        for (var e = -1, t = n == null ? 0 : n.length, r = 0, i = []; ++e < t; ) {
          var s = n[e];
          s && (i[r++] = s);
        }
        return i;
      }
      function Nc() {
        var n = arguments.length;
        if (!n)
          return [];
        for (var e = v(n - 1), t = arguments[0], r = n; r--; )
          e[r - 1] = arguments[r];
        return He(G(t) ? $n(t) : [t], Tn(e, 1));
      }
      var Wc = q(function(n, e) {
        return gn(n) ? Bt(n, Tn(e, 1, gn, !0)) : [];
      }), $c = q(function(n, e) {
        var t = re(e);
        return gn(t) && (t = o), gn(n) ? Bt(n, Tn(e, 1, gn, !0), P(t, 2)) : [];
      }), Uc = q(function(n, e) {
        var t = re(e);
        return gn(t) && (t = o), gn(n) ? Bt(n, Tn(e, 1, gn, !0), o, t) : [];
      });
      function Fc(n, e, t) {
        var r = n == null ? 0 : n.length;
        return r ? (e = t || e === o ? 1 : z(e), te(n, e < 0 ? 0 : e, r)) : [];
      }
      function Bc(n, e, t) {
        var r = n == null ? 0 : n.length;
        return r ? (e = t || e === o ? 1 : z(e), e = r - e, te(n, 0, e < 0 ? 0 : e)) : [];
      }
      function Dc(n, e) {
        return n && n.length ? Sr(n, P(e, 3), !0, !0) : [];
      }
      function Gc(n, e) {
        return n && n.length ? Sr(n, P(e, 3), !0) : [];
      }
      function zc(n, e, t, r) {
        var i = n == null ? 0 : n.length;
        return i ? (t && typeof t != "number" && Nn(n, e, t) && (t = 0, r = i), Na(n, e, t, r)) : [];
      }
      function ds(n, e, t) {
        var r = n == null ? 0 : n.length;
        if (!r)
          return -1;
        var i = t == null ? 0 : z(t);
        return i < 0 && (i = bn(r + i, 0)), ur(n, P(e, 3), i);
      }
      function ps(n, e, t) {
        var r = n == null ? 0 : n.length;
        if (!r)
          return -1;
        var i = r - 1;
        return t !== o && (i = z(t), i = t < 0 ? bn(r + i, 0) : Rn(i, r - 1)), ur(n, P(e, 3), i, !0);
      }
      function gs(n) {
        var e = n == null ? 0 : n.length;
        return e ? Tn(n, 1) : [];
      }
      function Hc(n) {
        var e = n == null ? 0 : n.length;
        return e ? Tn(n, de) : [];
      }
      function kc(n, e) {
        var t = n == null ? 0 : n.length;
        return t ? (e = e === o ? 1 : z(e), Tn(n, e)) : [];
      }
      function qc(n) {
        for (var e = -1, t = n == null ? 0 : n.length, r = {}; ++e < t; ) {
          var i = n[e];
          r[i[0]] = i[1];
        }
        return r;
      }
      function vs(n) {
        return n && n.length ? n[0] : o;
      }
      function Yc(n, e, t) {
        var r = n == null ? 0 : n.length;
        if (!r)
          return -1;
        var i = t == null ? 0 : z(t);
        return i < 0 && (i = bn(r + i, 0)), dt(n, e, i);
      }
      function Kc(n) {
        var e = n == null ? 0 : n.length;
        return e ? te(n, 0, -1) : [];
      }
      var Zc = q(function(n) {
        var e = cn(n, Mi);
        return e.length && e[0] === n[0] ? Ei(e) : [];
      }), Xc = q(function(n) {
        var e = re(n), t = cn(n, Mi);
        return e === re(t) ? e = o : t.pop(), t.length && t[0] === n[0] ? Ei(t, P(e, 2)) : [];
      }), Jc = q(function(n) {
        var e = re(n), t = cn(n, Mi);
        return e = typeof e == "function" ? e : o, e && t.pop(), t.length && t[0] === n[0] ? Ei(t, o, e) : [];
      });
      function Vc(n, e) {
        return n == null ? "" : Kl.call(n, e);
      }
      function re(n) {
        var e = n == null ? 0 : n.length;
        return e ? n[e - 1] : o;
      }
      function Qc(n, e, t) {
        var r = n == null ? 0 : n.length;
        if (!r)
          return -1;
        var i = r;
        return t !== o && (i = z(t), i = i < 0 ? bn(r + i, 0) : Rn(i, r - 1)), e === e ? Ll(n, e, i) : ur(n, Jo, i, !0);
      }
      function jc(n, e) {
        return n && n.length ? Su(n, z(e)) : o;
      }
      var nh = q(_s);
      function _s(n, e) {
        return n && n.length && e && e.length ? Si(n, e) : n;
      }
      function eh(n, e, t) {
        return n && n.length && e && e.length ? Si(n, e, P(t, 2)) : n;
      }
      function th(n, e, t) {
        return n && n.length && e && e.length ? Si(n, e, o, t) : n;
      }
      var rh = Se(function(n, e) {
        var t = n == null ? 0 : n.length, r = wi(n, e);
        return Ou(n, cn(e, function(i) {
          return Re(i, t) ? +i : i;
        }).sort(Du)), r;
      });
      function ih(n, e) {
        var t = [];
        if (!(n && n.length))
          return t;
        var r = -1, i = [], s = n.length;
        for (e = P(e, 3); ++r < s; ) {
          var f = n[r];
          e(f, r, n) && (t.push(f), i.push(r));
        }
        return Ou(n, i), t;
      }
      function Ki(n) {
        return n == null ? n : Vl.call(n);
      }
      function oh(n, e, t) {
        var r = n == null ? 0 : n.length;
        return r ? (t && typeof t != "number" && Nn(n, e, t) ? (e = 0, t = r) : (e = e == null ? 0 : z(e), t = t === o ? r : z(t)), te(n, e, t)) : [];
      }
      function uh(n, e) {
        return Cr(n, e);
      }
      function sh(n, e, t) {
        return Oi(n, e, P(t, 2));
      }
      function fh(n, e) {
        var t = n == null ? 0 : n.length;
        if (t) {
          var r = Cr(n, e);
          if (r < t && ae(n[r], e))
            return r;
        }
        return -1;
      }
      function lh(n, e) {
        return Cr(n, e, !0);
      }
      function ah(n, e, t) {
        return Oi(n, e, P(t, 2), !0);
      }
      function ch(n, e) {
        var t = n == null ? 0 : n.length;
        if (t) {
          var r = Cr(n, e, !0) - 1;
          if (ae(n[r], e))
            return r;
        }
        return -1;
      }
      function hh(n) {
        return n && n.length ? Pu(n) : [];
      }
      function dh(n, e) {
        return n && n.length ? Pu(n, P(e, 2)) : [];
      }
      function ph(n) {
        var e = n == null ? 0 : n.length;
        return e ? te(n, 1, e) : [];
      }
      function gh(n, e, t) {
        return n && n.length ? (e = t || e === o ? 1 : z(e), te(n, 0, e < 0 ? 0 : e)) : [];
      }
      function vh(n, e, t) {
        var r = n == null ? 0 : n.length;
        return r ? (e = t || e === o ? 1 : z(e), e = r - e, te(n, e < 0 ? 0 : e, r)) : [];
      }
      function _h(n, e) {
        return n && n.length ? Sr(n, P(e, 3), !1, !0) : [];
      }
      function mh(n, e) {
        return n && n.length ? Sr(n, P(e, 3)) : [];
      }
      var wh = q(function(n) {
        return Ke(Tn(n, 1, gn, !0));
      }), bh = q(function(n) {
        var e = re(n);
        return gn(e) && (e = o), Ke(Tn(n, 1, gn, !0), P(e, 2));
      }), xh = q(function(n) {
        var e = re(n);
        return e = typeof e == "function" ? e : o, Ke(Tn(n, 1, gn, !0), o, e);
      });
      function yh(n) {
        return n && n.length ? Ke(n) : [];
      }
      function Eh(n, e) {
        return n && n.length ? Ke(n, P(e, 2)) : [];
      }
      function Ah(n, e) {
        return e = typeof e == "function" ? e : o, n && n.length ? Ke(n, o, e) : [];
      }
      function Zi(n) {
        if (!(n && n.length))
          return [];
        var e = 0;
        return n = ze(n, function(t) {
          if (gn(t))
            return e = bn(t.length, e), !0;
        }), ci(e, function(t) {
          return cn(n, fi(t));
        });
      }
      function ms(n, e) {
        if (!(n && n.length))
          return [];
        var t = Zi(n);
        return e == null ? t : cn(t, function(r) {
          return Gn(e, o, r);
        });
      }
      var Th = q(function(n, e) {
        return gn(n) ? Bt(n, e) : [];
      }), Ch = q(function(n) {
        return Pi(ze(n, gn));
      }), Sh = q(function(n) {
        var e = re(n);
        return gn(e) && (e = o), Pi(ze(n, gn), P(e, 2));
      }), Rh = q(function(n) {
        var e = re(n);
        return e = typeof e == "function" ? e : o, Pi(ze(n, gn), o, e);
      }), Ih = q(Zi);
      function Oh(n, e) {
        return $u(n || [], e || [], Ft);
      }
      function Lh(n, e) {
        return $u(n || [], e || [], zt);
      }
      var Ph = q(function(n) {
        var e = n.length, t = e > 1 ? n[e - 1] : o;
        return t = typeof t == "function" ? (n.pop(), t) : o, ms(n, t);
      });
      function ws(n) {
        var e = u(n);
        return e.__chain__ = !0, e;
      }
      function Mh(n, e) {
        return e(n), n;
      }
      function $r(n, e) {
        return e(n);
      }
      var Nh = Se(function(n) {
        var e = n.length, t = e ? n[0] : 0, r = this.__wrapped__, i = function(s) {
          return wi(s, n);
        };
        return e > 1 || this.__actions__.length || !(r instanceof X) || !Re(t) ? this.thru(i) : (r = r.slice(t, +t + (e ? 1 : 0)), r.__actions__.push({
          func: $r,
          args: [i],
          thisArg: o
        }), new ne(r, this.__chain__).thru(function(s) {
          return e && !s.length && s.push(o), s;
        }));
      });
      function Wh() {
        return ws(this);
      }
      function $h() {
        return new ne(this.value(), this.__chain__);
      }
      function Uh() {
        this.__values__ === o && (this.__values__ = Ms(this.value()));
        var n = this.__index__ >= this.__values__.length, e = n ? o : this.__values__[this.__index__++];
        return { done: n, value: e };
      }
      function Fh() {
        return this;
      }
      function Bh(n) {
        for (var e, t = this; t instanceof xr; ) {
          var r = hs(t);
          r.__index__ = 0, r.__values__ = o, e ? i.__wrapped__ = r : e = r;
          var i = r;
          t = t.__wrapped__;
        }
        return i.__wrapped__ = n, e;
      }
      function Dh() {
        var n = this.__wrapped__;
        if (n instanceof X) {
          var e = n;
          return this.__actions__.length && (e = new X(this)), e = e.reverse(), e.__actions__.push({
            func: $r,
            args: [Ki],
            thisArg: o
          }), new ne(e, this.__chain__);
        }
        return this.thru(Ki);
      }
      function Gh() {
        return Wu(this.__wrapped__, this.__actions__);
      }
      var zh = Rr(function(n, e, t) {
        rn.call(n, t) ? ++n[t] : Te(n, t, 1);
      });
      function Hh(n, e, t) {
        var r = G(n) ? Zo : Ma;
        return t && Nn(n, e, t) && (e = o), r(n, P(e, 3));
      }
      function kh(n, e) {
        var t = G(n) ? ze : mu;
        return t(n, P(e, 3));
      }
      var qh = Yu(ds), Yh = Yu(ps);
      function Kh(n, e) {
        return Tn(Ur(n, e), 1);
      }
      function Zh(n, e) {
        return Tn(Ur(n, e), de);
      }
      function Xh(n, e, t) {
        return t = t === o ? 1 : z(t), Tn(Ur(n, e), t);
      }
      function bs(n, e) {
        var t = G(n) ? Qn : Ye;
        return t(n, P(e, 3));
      }
      function xs(n, e) {
        var t = G(n) ? pl : _u;
        return t(n, P(e, 3));
      }
      var Jh = Rr(function(n, e, t) {
        rn.call(n, t) ? n[t].push(e) : Te(n, t, [e]);
      });
      function Vh(n, e, t, r) {
        n = Un(n) ? n : Tt(n), t = t && !r ? z(t) : 0;
        var i = n.length;
        return t < 0 && (t = bn(i + t, 0)), zr(n) ? t <= i && n.indexOf(e, t) > -1 : !!i && dt(n, e, t) > -1;
      }
      var Qh = q(function(n, e, t) {
        var r = -1, i = typeof e == "function", s = Un(n) ? v(n.length) : [];
        return Ye(n, function(f) {
          s[++r] = i ? Gn(e, f, t) : Dt(f, e, t);
        }), s;
      }), jh = Rr(function(n, e, t) {
        Te(n, t, e);
      });
      function Ur(n, e) {
        var t = G(n) ? cn : Au;
        return t(n, P(e, 3));
      }
      function nd(n, e, t, r) {
        return n == null ? [] : (G(e) || (e = e == null ? [] : [e]), t = r ? o : t, G(t) || (t = t == null ? [] : [t]), Ru(n, e, t));
      }
      var ed = Rr(function(n, e, t) {
        n[t ? 0 : 1].push(e);
      }, function() {
        return [[], []];
      });
      function td(n, e, t) {
        var r = G(n) ? ui : Qo, i = arguments.length < 3;
        return r(n, P(e, 4), t, i, Ye);
      }
      function rd(n, e, t) {
        var r = G(n) ? gl : Qo, i = arguments.length < 3;
        return r(n, P(e, 4), t, i, _u);
      }
      function id(n, e) {
        var t = G(n) ? ze : mu;
        return t(n, Dr(P(e, 3)));
      }
      function od(n) {
        var e = G(n) ? du : Va;
        return e(n);
      }
      function ud(n, e, t) {
        (t ? Nn(n, e, t) : e === o) ? e = 1 : e = z(e);
        var r = G(n) ? Ra : Qa;
        return r(n, e);
      }
      function sd(n) {
        var e = G(n) ? Ia : nc;
        return e(n);
      }
      function fd(n) {
        if (n == null)
          return 0;
        if (Un(n))
          return zr(n) ? gt(n) : n.length;
        var e = In(n);
        return e == Pn || e == c ? n.size : Ti(n).length;
      }
      function ld(n, e, t) {
        var r = G(n) ? si : ec;
        return t && Nn(n, e, t) && (e = o), r(n, P(e, 3));
      }
      var ad = q(function(n, e) {
        if (n == null)
          return [];
        var t = e.length;
        return t > 1 && Nn(n, e[0], e[1]) ? e = [] : t > 2 && Nn(e[0], e[1], e[2]) && (e = [e[0]]), Ru(n, Tn(e, 1), []);
      }), Fr = kl || function() {
        return An.Date.now();
      };
      function cd(n, e) {
        if (typeof e != "function")
          throw new jn(E);
        return n = z(n), function() {
          if (--n < 1)
            return e.apply(this, arguments);
        };
      }
      function ys(n, e, t) {
        return e = t ? o : e, e = n && e == null ? n.length : e, Ce(n, On, o, o, o, o, e);
      }
      function Es(n, e) {
        var t;
        if (typeof e != "function")
          throw new jn(E);
        return n = z(n), function() {
          return --n > 0 && (t = e.apply(this, arguments)), n <= 1 && (e = o), t;
        };
      }
      var Xi = q(function(n, e, t) {
        var r = B;
        if (t.length) {
          var i = ke(t, Et(Xi));
          r |= Cn;
        }
        return Ce(n, r, e, t, i);
      }), As = q(function(n, e, t) {
        var r = B | nn;
        if (t.length) {
          var i = ke(t, Et(As));
          r |= Cn;
        }
        return Ce(e, r, n, t, i);
      });
      function Ts(n, e, t) {
        e = t ? o : e;
        var r = Ce(n, yn, o, o, o, o, o, e);
        return r.placeholder = Ts.placeholder, r;
      }
      function Cs(n, e, t) {
        e = t ? o : e;
        var r = Ce(n, En, o, o, o, o, o, e);
        return r.placeholder = Cs.placeholder, r;
      }
      function Ss(n, e, t) {
        var r, i, s, f, a, p, w = 0, b = !1, y = !1, T = !0;
        if (typeof n != "function")
          throw new jn(E);
        e = ie(e) || 0, hn(t) && (b = !!t.leading, y = "maxWait" in t, s = y ? bn(ie(t.maxWait) || 0, e) : s, T = "trailing" in t ? !!t.trailing : T);
        function O(vn) {
          var ce = r, Le = i;
          return r = i = o, w = vn, f = n.apply(Le, ce), f;
        }
        function N(vn) {
          return w = vn, a = qt(K, e), b ? O(vn) : f;
        }
        function k(vn) {
          var ce = vn - p, Le = vn - w, Ys = e - ce;
          return y ? Rn(Ys, s - Le) : Ys;
        }
        function W(vn) {
          var ce = vn - p, Le = vn - w;
          return p === o || ce >= e || ce < 0 || y && Le >= s;
        }
        function K() {
          var vn = Fr();
          if (W(vn))
            return J(vn);
          a = qt(K, k(vn));
        }
        function J(vn) {
          return a = o, T && r ? O(vn) : (r = i = o, f);
        }
        function qn() {
          a !== o && Uu(a), w = 0, r = p = i = a = o;
        }
        function Wn() {
          return a === o ? f : J(Fr());
        }
        function Yn() {
          var vn = Fr(), ce = W(vn);
          if (r = arguments, i = this, p = vn, ce) {
            if (a === o)
              return N(p);
            if (y)
              return Uu(a), a = qt(K, e), O(p);
          }
          return a === o && (a = qt(K, e)), f;
        }
        return Yn.cancel = qn, Yn.flush = Wn, Yn;
      }
      var hd = q(function(n, e) {
        return vu(n, 1, e);
      }), dd = q(function(n, e, t) {
        return vu(n, ie(e) || 0, t);
      });
      function pd(n) {
        return Ce(n, he);
      }
      function Br(n, e) {
        if (typeof n != "function" || e != null && typeof e != "function")
          throw new jn(E);
        var t = function() {
          var r = arguments, i = e ? e.apply(this, r) : r[0], s = t.cache;
          if (s.has(i))
            return s.get(i);
          var f = n.apply(this, r);
          return t.cache = s.set(i, f) || s, f;
        };
        return t.cache = new (Br.Cache || Ae)(), t;
      }
      Br.Cache = Ae;
      function Dr(n) {
        if (typeof n != "function")
          throw new jn(E);
        return function() {
          var e = arguments;
          switch (e.length) {
            case 0:
              return !n.call(this);
            case 1:
              return !n.call(this, e[0]);
            case 2:
              return !n.call(this, e[0], e[1]);
            case 3:
              return !n.call(this, e[0], e[1], e[2]);
          }
          return !n.apply(this, e);
        };
      }
      function gd(n) {
        return Es(2, n);
      }
      var vd = tc(function(n, e) {
        e = e.length == 1 && G(e[0]) ? cn(e[0], zn(P())) : cn(Tn(e, 1), zn(P()));
        var t = e.length;
        return q(function(r) {
          for (var i = -1, s = Rn(r.length, t); ++i < s; )
            r[i] = e[i].call(this, r[i]);
          return Gn(n, this, r);
        });
      }), Ji = q(function(n, e) {
        var t = ke(e, Et(Ji));
        return Ce(n, Cn, o, e, t);
      }), Rs = q(function(n, e) {
        var t = ke(e, Et(Rs));
        return Ce(n, Kn, o, e, t);
      }), _d = Se(function(n, e) {
        return Ce(n, oe, o, o, o, e);
      });
      function md(n, e) {
        if (typeof n != "function")
          throw new jn(E);
        return e = e === o ? e : z(e), q(n, e);
      }
      function wd(n, e) {
        if (typeof n != "function")
          throw new jn(E);
        return e = e == null ? 0 : bn(z(e), 0), q(function(t) {
          var r = t[e], i = Xe(t, 0, e);
          return r && He(i, r), Gn(n, this, i);
        });
      }
      function bd(n, e, t) {
        var r = !0, i = !0;
        if (typeof n != "function")
          throw new jn(E);
        return hn(t) && (r = "leading" in t ? !!t.leading : r, i = "trailing" in t ? !!t.trailing : i), Ss(n, e, {
          leading: r,
          maxWait: e,
          trailing: i
        });
      }
      function xd(n) {
        return ys(n, 1);
      }
      function yd(n, e) {
        return Ji(Ni(e), n);
      }
      function Ed() {
        if (!arguments.length)
          return [];
        var n = arguments[0];
        return G(n) ? n : [n];
      }
      function Ad(n) {
        return ee(n, V);
      }
      function Td(n, e) {
        return e = typeof e == "function" ? e : o, ee(n, V, e);
      }
      function Cd(n) {
        return ee(n, $ | V);
      }
      function Sd(n, e) {
        return e = typeof e == "function" ? e : o, ee(n, $ | V, e);
      }
      function Rd(n, e) {
        return e == null || gu(n, e, xn(e));
      }
      function ae(n, e) {
        return n === e || n !== n && e !== e;
      }
      var Id = Pr(yi), Od = Pr(function(n, e) {
        return n >= e;
      }), at = xu(/* @__PURE__ */ function() {
        return arguments;
      }()) ? xu : function(n) {
        return pn(n) && rn.call(n, "callee") && !su.call(n, "callee");
      }, G = v.isArray, Ld = zo ? zn(zo) : Ba;
      function Un(n) {
        return n != null && Gr(n.length) && !Ie(n);
      }
      function gn(n) {
        return pn(n) && Un(n);
      }
      function Pd(n) {
        return n === !0 || n === !1 || pn(n) && Mn(n) == Ue;
      }
      var Je = Yl || so, Md = Ho ? zn(Ho) : Da;
      function Nd(n) {
        return pn(n) && n.nodeType === 1 && !Yt(n);
      }
      function Wd(n) {
        if (n == null)
          return !0;
        if (Un(n) && (G(n) || typeof n == "string" || typeof n.splice == "function" || Je(n) || At(n) || at(n)))
          return !n.length;
        var e = In(n);
        if (e == Pn || e == c)
          return !n.size;
        if (kt(n))
          return !Ti(n).length;
        for (var t in n)
          if (rn.call(n, t))
            return !1;
        return !0;
      }
      function $d(n, e) {
        return Gt(n, e);
      }
      function Ud(n, e, t) {
        t = typeof t == "function" ? t : o;
        var r = t ? t(n, e) : o;
        return r === o ? Gt(n, e, o, t) : !!r;
      }
      function Vi(n) {
        if (!pn(n))
          return !1;
        var e = Mn(n);
        return e == et || e == nr || typeof n.message == "string" && typeof n.name == "string" && !Yt(n);
      }
      function Fd(n) {
        return typeof n == "number" && lu(n);
      }
      function Ie(n) {
        if (!hn(n))
          return !1;
        var e = Mn(n);
        return e == Be || e == Ot || e == jt || e == er;
      }
      function Is(n) {
        return typeof n == "number" && n == z(n);
      }
      function Gr(n) {
        return typeof n == "number" && n > -1 && n % 1 == 0 && n <= Zn;
      }
      function hn(n) {
        var e = typeof n;
        return n != null && (e == "object" || e == "function");
      }
      function pn(n) {
        return n != null && typeof n == "object";
      }
      var Os = ko ? zn(ko) : za;
      function Bd(n, e) {
        return n === e || Ai(n, e, Gi(e));
      }
      function Dd(n, e, t) {
        return t = typeof t == "function" ? t : o, Ai(n, e, Gi(e), t);
      }
      function Gd(n) {
        return Ls(n) && n != +n;
      }
      function zd(n) {
        if (Tc(n))
          throw new D(m);
        return yu(n);
      }
      function Hd(n) {
        return n === null;
      }
      function kd(n) {
        return n == null;
      }
      function Ls(n) {
        return typeof n == "number" || pn(n) && Mn(n) == xe;
      }
      function Yt(n) {
        if (!pn(n) || Mn(n) != Xn)
          return !1;
        var e = pr(n);
        if (e === null)
          return !0;
        var t = rn.call(e, "constructor") && e.constructor;
        return typeof t == "function" && t instanceof t && ar.call(t) == Dl;
      }
      var Qi = qo ? zn(qo) : Ha;
      function qd(n) {
        return Is(n) && n >= -9007199254740991 && n <= Zn;
      }
      var Ps = Yo ? zn(Yo) : ka;
      function zr(n) {
        return typeof n == "string" || !G(n) && pn(n) && Mn(n) == R;
      }
      function kn(n) {
        return typeof n == "symbol" || pn(n) && Mn(n) == I;
      }
      var At = Ko ? zn(Ko) : qa;
      function Yd(n) {
        return n === o;
      }
      function Kd(n) {
        return pn(n) && In(n) == dn;
      }
      function Zd(n) {
        return pn(n) && Mn(n) == fn;
      }
      var Xd = Pr(Ci), Jd = Pr(function(n, e) {
        return n <= e;
      });
      function Ms(n) {
        if (!n)
          return [];
        if (Un(n))
          return zr(n) ? fe(n) : $n(n);
        if (Mt && n[Mt])
          return Rl(n[Mt]());
        var e = In(n), t = e == Pn ? di : e == c ? sr : Tt;
        return t(n);
      }
      function Oe(n) {
        if (!n)
          return n === 0 ? n : 0;
        if (n = ie(n), n === de || n === -1 / 0) {
          var e = n < 0 ? -1 : 1;
          return e * Ln;
        }
        return n === n ? n : 0;
      }
      function z(n) {
        var e = Oe(n), t = e % 1;
        return e === e ? t ? e - t : e : 0;
      }
      function Ns(n) {
        return n ? ut(z(n), 0, on) : 0;
      }
      function ie(n) {
        if (typeof n == "number")
          return n;
        if (kn(n))
          return pe;
        if (hn(n)) {
          var e = typeof n.valueOf == "function" ? n.valueOf() : n;
          n = hn(e) ? e + "" : e;
        }
        if (typeof n != "string")
          return n === 0 ? n : +n;
        n = jo(n);
        var t = Lf.test(n);
        return t || Mf.test(n) ? cl(n.slice(2), t ? 2 : 8) : Of.test(n) ? pe : +n;
      }
      function Ws(n) {
        return _e(n, Fn(n));
      }
      function Vd(n) {
        return n ? ut(z(n), -9007199254740991, Zn) : n === 0 ? n : 0;
      }
      function tn(n) {
        return n == null ? "" : Hn(n);
      }
      var Qd = xt(function(n, e) {
        if (kt(e) || Un(e)) {
          _e(e, xn(e), n);
          return;
        }
        for (var t in e)
          rn.call(e, t) && Ft(n, t, e[t]);
      }), $s = xt(function(n, e) {
        _e(e, Fn(e), n);
      }), Hr = xt(function(n, e, t, r) {
        _e(e, Fn(e), n, r);
      }), jd = xt(function(n, e, t, r) {
        _e(e, xn(e), n, r);
      }), np = Se(wi);
      function ep(n, e) {
        var t = bt(n);
        return e == null ? t : pu(t, e);
      }
      var tp = q(function(n, e) {
        n = un(n);
        var t = -1, r = e.length, i = r > 2 ? e[2] : o;
        for (i && Nn(e[0], e[1], i) && (r = 1); ++t < r; )
          for (var s = e[t], f = Fn(s), a = -1, p = f.length; ++a < p; ) {
            var w = f[a], b = n[w];
            (b === o || ae(b, _t[w]) && !rn.call(n, w)) && (n[w] = s[w]);
          }
        return n;
      }), rp = q(function(n) {
        return n.push(o, ju), Gn(Us, o, n);
      });
      function ip(n, e) {
        return Xo(n, P(e, 3), ve);
      }
      function op(n, e) {
        return Xo(n, P(e, 3), xi);
      }
      function up(n, e) {
        return n == null ? n : bi(n, P(e, 3), Fn);
      }
      function sp(n, e) {
        return n == null ? n : wu(n, P(e, 3), Fn);
      }
      function fp(n, e) {
        return n && ve(n, P(e, 3));
      }
      function lp(n, e) {
        return n && xi(n, P(e, 3));
      }
      function ap(n) {
        return n == null ? [] : Ar(n, xn(n));
      }
      function cp(n) {
        return n == null ? [] : Ar(n, Fn(n));
      }
      function ji(n, e, t) {
        var r = n == null ? o : st(n, e);
        return r === o ? t : r;
      }
      function hp(n, e) {
        return n != null && ts(n, e, Wa);
      }
      function no(n, e) {
        return n != null && ts(n, e, $a);
      }
      var dp = Zu(function(n, e, t) {
        e != null && typeof e.toString != "function" && (e = cr.call(e)), n[e] = t;
      }, to(Bn)), pp = Zu(function(n, e, t) {
        e != null && typeof e.toString != "function" && (e = cr.call(e)), rn.call(n, e) ? n[e].push(t) : n[e] = [t];
      }, P), gp = q(Dt);
      function xn(n) {
        return Un(n) ? hu(n) : Ti(n);
      }
      function Fn(n) {
        return Un(n) ? hu(n, !0) : Ya(n);
      }
      function vp(n, e) {
        var t = {};
        return e = P(e, 3), ve(n, function(r, i, s) {
          Te(t, e(r, i, s), r);
        }), t;
      }
      function _p(n, e) {
        var t = {};
        return e = P(e, 3), ve(n, function(r, i, s) {
          Te(t, i, e(r, i, s));
        }), t;
      }
      var mp = xt(function(n, e, t) {
        Tr(n, e, t);
      }), Us = xt(function(n, e, t, r) {
        Tr(n, e, t, r);
      }), wp = Se(function(n, e) {
        var t = {};
        if (n == null)
          return t;
        var r = !1;
        e = cn(e, function(s) {
          return s = Ze(s, n), r || (r = s.length > 1), s;
        }), _e(n, Bi(n), t), r && (t = ee(t, $ | M | V, dc));
        for (var i = e.length; i--; )
          Li(t, e[i]);
        return t;
      });
      function bp(n, e) {
        return Fs(n, Dr(P(e)));
      }
      var xp = Se(function(n, e) {
        return n == null ? {} : Za(n, e);
      });
      function Fs(n, e) {
        if (n == null)
          return {};
        var t = cn(Bi(n), function(r) {
          return [r];
        });
        return e = P(e), Iu(n, t, function(r, i) {
          return e(r, i[0]);
        });
      }
      function yp(n, e, t) {
        e = Ze(e, n);
        var r = -1, i = e.length;
        for (i || (i = 1, n = o); ++r < i; ) {
          var s = n == null ? o : n[me(e[r])];
          s === o && (r = i, s = t), n = Ie(s) ? s.call(n) : s;
        }
        return n;
      }
      function Ep(n, e, t) {
        return n == null ? n : zt(n, e, t);
      }
      function Ap(n, e, t, r) {
        return r = typeof r == "function" ? r : o, n == null ? n : zt(n, e, t, r);
      }
      var Bs = Vu(xn), Ds = Vu(Fn);
      function Tp(n, e, t) {
        var r = G(n), i = r || Je(n) || At(n);
        if (e = P(e, 4), t == null) {
          var s = n && n.constructor;
          i ? t = r ? new s() : [] : hn(n) ? t = Ie(s) ? bt(pr(n)) : {} : t = {};
        }
        return (i ? Qn : ve)(n, function(f, a, p) {
          return e(t, f, a, p);
        }), t;
      }
      function Cp(n, e) {
        return n == null ? !0 : Li(n, e);
      }
      function Sp(n, e, t) {
        return n == null ? n : Nu(n, e, Ni(t));
      }
      function Rp(n, e, t, r) {
        return r = typeof r == "function" ? r : o, n == null ? n : Nu(n, e, Ni(t), r);
      }
      function Tt(n) {
        return n == null ? [] : hi(n, xn(n));
      }
      function Ip(n) {
        return n == null ? [] : hi(n, Fn(n));
      }
      function Op(n, e, t) {
        return t === o && (t = e, e = o), t !== o && (t = ie(t), t = t === t ? t : 0), e !== o && (e = ie(e), e = e === e ? e : 0), ut(ie(n), e, t);
      }
      function Lp(n, e, t) {
        return e = Oe(e), t === o ? (t = e, e = 0) : t = Oe(t), n = ie(n), Ua(n, e, t);
      }
      function Pp(n, e, t) {
        if (t && typeof t != "boolean" && Nn(n, e, t) && (e = t = o), t === o && (typeof e == "boolean" ? (t = e, e = o) : typeof n == "boolean" && (t = n, n = o)), n === o && e === o ? (n = 0, e = 1) : (n = Oe(n), e === o ? (e = n, n = 0) : e = Oe(e)), n > e) {
          var r = n;
          n = e, e = r;
        }
        if (t || n % 1 || e % 1) {
          var i = au();
          return Rn(n + i * (e - n + al("1e-" + ((i + "").length - 1))), e);
        }
        return Ri(n, e);
      }
      var Mp = yt(function(n, e, t) {
        return e = e.toLowerCase(), n + (t ? Gs(e) : e);
      });
      function Gs(n) {
        return eo(tn(n).toLowerCase());
      }
      function zs(n) {
        return n = tn(n), n && n.replace(Wf, El).replace(nl, "");
      }
      function Np(n, e, t) {
        n = tn(n), e = Hn(e);
        var r = n.length;
        t = t === o ? r : ut(z(t), 0, r);
        var i = t;
        return t -= e.length, t >= 0 && n.slice(t, i) == e;
      }
      function Wp(n) {
        return n = tn(n), n && gf.test(n) ? n.replace(wo, Al) : n;
      }
      function $p(n) {
        return n = tn(n), n && xf.test(n) ? n.replace(Jr, "\\$&") : n;
      }
      var Up = yt(function(n, e, t) {
        return n + (t ? "-" : "") + e.toLowerCase();
      }), Fp = yt(function(n, e, t) {
        return n + (t ? " " : "") + e.toLowerCase();
      }), Bp = qu("toLowerCase");
      function Dp(n, e, t) {
        n = tn(n), e = z(e);
        var r = e ? gt(n) : 0;
        if (!e || r >= e)
          return n;
        var i = (e - r) / 2;
        return Lr(mr(i), t) + n + Lr(_r(i), t);
      }
      function Gp(n, e, t) {
        n = tn(n), e = z(e);
        var r = e ? gt(n) : 0;
        return e && r < e ? n + Lr(e - r, t) : n;
      }
      function zp(n, e, t) {
        n = tn(n), e = z(e);
        var r = e ? gt(n) : 0;
        return e && r < e ? Lr(e - r, t) + n : n;
      }
      function Hp(n, e, t) {
        return t || e == null ? e = 0 : e && (e = +e), Jl(tn(n).replace(Vr, ""), e || 0);
      }
      function kp(n, e, t) {
        return (t ? Nn(n, e, t) : e === o) ? e = 1 : e = z(e), Ii(tn(n), e);
      }
      function qp() {
        var n = arguments, e = tn(n[0]);
        return n.length < 3 ? e : e.replace(n[1], n[2]);
      }
      var Yp = yt(function(n, e, t) {
        return n + (t ? "_" : "") + e.toLowerCase();
      });
      function Kp(n, e, t) {
        return t && typeof t != "number" && Nn(n, e, t) && (e = t = o), t = t === o ? on : t >>> 0, t ? (n = tn(n), n && (typeof e == "string" || e != null && !Qi(e)) && (e = Hn(e), !e && pt(n)) ? Xe(fe(n), 0, t) : n.split(e, t)) : [];
      }
      var Zp = yt(function(n, e, t) {
        return n + (t ? " " : "") + eo(e);
      });
      function Xp(n, e, t) {
        return n = tn(n), t = t == null ? 0 : ut(z(t), 0, n.length), e = Hn(e), n.slice(t, t + e.length) == e;
      }
      function Jp(n, e, t) {
        var r = u.templateSettings;
        t && Nn(n, e, t) && (e = o), n = tn(n), e = Hr({}, e, r, Qu);
        var i = Hr({}, e.imports, r.imports, Qu), s = xn(i), f = hi(i, s), a, p, w = 0, b = e.interpolate || tr, y = "__p += '", T = pi(
          (e.escape || tr).source + "|" + b.source + "|" + (b === bo ? If : tr).source + "|" + (e.evaluate || tr).source + "|$",
          "g"
        ), O = "//# sourceURL=" + (rn.call(e, "sourceURL") ? (e.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++ol + "]") + `
`;
        n.replace(T, function(W, K, J, qn, Wn, Yn) {
          return J || (J = qn), y += n.slice(w, Yn).replace($f, Tl), K && (a = !0, y += `' +
__e(` + K + `) +
'`), Wn && (p = !0, y += `';
` + Wn + `;
__p += '`), J && (y += `' +
((__t = (` + J + `)) == null ? '' : __t) +
'`), w = Yn + W.length, W;
        }), y += `';
`;
        var N = rn.call(e, "variable") && e.variable;
        if (!N)
          y = `with (obj) {
` + y + `
}
`;
        else if (Sf.test(N))
          throw new D(A);
        y = (p ? y.replace(cf, "") : y).replace(hf, "$1").replace(df, "$1;"), y = "function(" + (N || "obj") + `) {
` + (N ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (p ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + y + `return __p
}`;
        var k = ks(function() {
          return j(s, O + "return " + y).apply(o, f);
        });
        if (k.source = y, Vi(k))
          throw k;
        return k;
      }
      function Vp(n) {
        return tn(n).toLowerCase();
      }
      function Qp(n) {
        return tn(n).toUpperCase();
      }
      function jp(n, e, t) {
        if (n = tn(n), n && (t || e === o))
          return jo(n);
        if (!n || !(e = Hn(e)))
          return n;
        var r = fe(n), i = fe(e), s = nu(r, i), f = eu(r, i) + 1;
        return Xe(r, s, f).join("");
      }
      function ng(n, e, t) {
        if (n = tn(n), n && (t || e === o))
          return n.slice(0, ru(n) + 1);
        if (!n || !(e = Hn(e)))
          return n;
        var r = fe(n), i = eu(r, fe(e)) + 1;
        return Xe(r, 0, i).join("");
      }
      function eg(n, e, t) {
        if (n = tn(n), n && (t || e === o))
          return n.replace(Vr, "");
        if (!n || !(e = Hn(e)))
          return n;
        var r = fe(n), i = nu(r, fe(e));
        return Xe(r, i).join("");
      }
      function tg(n, e) {
        var t = Me, r = we;
        if (hn(e)) {
          var i = "separator" in e ? e.separator : i;
          t = "length" in e ? z(e.length) : t, r = "omission" in e ? Hn(e.omission) : r;
        }
        n = tn(n);
        var s = n.length;
        if (pt(n)) {
          var f = fe(n);
          s = f.length;
        }
        if (t >= s)
          return n;
        var a = t - gt(r);
        if (a < 1)
          return r;
        var p = f ? Xe(f, 0, a).join("") : n.slice(0, a);
        if (i === o)
          return p + r;
        if (f && (a += p.length - a), Qi(i)) {
          if (n.slice(a).search(i)) {
            var w, b = p;
            for (i.global || (i = pi(i.source, tn(xo.exec(i)) + "g")), i.lastIndex = 0; w = i.exec(b); )
              var y = w.index;
            p = p.slice(0, y === o ? a : y);
          }
        } else if (n.indexOf(Hn(i), a) != a) {
          var T = p.lastIndexOf(i);
          T > -1 && (p = p.slice(0, T));
        }
        return p + r;
      }
      function rg(n) {
        return n = tn(n), n && pf.test(n) ? n.replace(mo, Pl) : n;
      }
      var ig = yt(function(n, e, t) {
        return n + (t ? " " : "") + e.toUpperCase();
      }), eo = qu("toUpperCase");
      function Hs(n, e, t) {
        return n = tn(n), e = t ? o : e, e === o ? Sl(n) ? Wl(n) : ml(n) : n.match(e) || [];
      }
      var ks = q(function(n, e) {
        try {
          return Gn(n, o, e);
        } catch (t) {
          return Vi(t) ? t : new D(t);
        }
      }), og = Se(function(n, e) {
        return Qn(e, function(t) {
          t = me(t), Te(n, t, Xi(n[t], n));
        }), n;
      });
      function ug(n) {
        var e = n == null ? 0 : n.length, t = P();
        return n = e ? cn(n, function(r) {
          if (typeof r[1] != "function")
            throw new jn(E);
          return [t(r[0]), r[1]];
        }) : [], q(function(r) {
          for (var i = -1; ++i < e; ) {
            var s = n[i];
            if (Gn(s[0], this, r))
              return Gn(s[1], this, r);
          }
        });
      }
      function sg(n) {
        return Pa(ee(n, $));
      }
      function to(n) {
        return function() {
          return n;
        };
      }
      function fg(n, e) {
        return n == null || n !== n ? e : n;
      }
      var lg = Ku(), ag = Ku(!0);
      function Bn(n) {
        return n;
      }
      function ro(n) {
        return Eu(typeof n == "function" ? n : ee(n, $));
      }
      function cg(n) {
        return Tu(ee(n, $));
      }
      function hg(n, e) {
        return Cu(n, ee(e, $));
      }
      var dg = q(function(n, e) {
        return function(t) {
          return Dt(t, n, e);
        };
      }), pg = q(function(n, e) {
        return function(t) {
          return Dt(n, t, e);
        };
      });
      function io(n, e, t) {
        var r = xn(e), i = Ar(e, r);
        t == null && !(hn(e) && (i.length || !r.length)) && (t = e, e = n, n = this, i = Ar(e, xn(e)));
        var s = !(hn(t) && "chain" in t) || !!t.chain, f = Ie(n);
        return Qn(i, function(a) {
          var p = e[a];
          n[a] = p, f && (n.prototype[a] = function() {
            var w = this.__chain__;
            if (s || w) {
              var b = n(this.__wrapped__), y = b.__actions__ = $n(this.__actions__);
              return y.push({ func: p, args: arguments, thisArg: n }), b.__chain__ = w, b;
            }
            return p.apply(n, He([this.value()], arguments));
          });
        }), n;
      }
      function gg() {
        return An._ === this && (An._ = Gl), this;
      }
      function oo() {
      }
      function vg(n) {
        return n = z(n), q(function(e) {
          return Su(e, n);
        });
      }
      var _g = $i(cn), mg = $i(Zo), wg = $i(si);
      function qs(n) {
        return Hi(n) ? fi(me(n)) : Xa(n);
      }
      function bg(n) {
        return function(e) {
          return n == null ? o : st(n, e);
        };
      }
      var xg = Xu(), yg = Xu(!0);
      function uo() {
        return [];
      }
      function so() {
        return !1;
      }
      function Eg() {
        return {};
      }
      function Ag() {
        return "";
      }
      function Tg() {
        return !0;
      }
      function Cg(n, e) {
        if (n = z(n), n < 1 || n > Zn)
          return [];
        var t = on, r = Rn(n, on);
        e = P(e), n -= on;
        for (var i = ci(r, e); ++t < n; )
          e(t);
        return i;
      }
      function Sg(n) {
        return G(n) ? cn(n, me) : kn(n) ? [n] : $n(cs(tn(n)));
      }
      function Rg(n) {
        var e = ++Bl;
        return tn(n) + e;
      }
      var Ig = Or(function(n, e) {
        return n + e;
      }, 0), Og = Ui("ceil"), Lg = Or(function(n, e) {
        return n / e;
      }, 1), Pg = Ui("floor");
      function Mg(n) {
        return n && n.length ? Er(n, Bn, yi) : o;
      }
      function Ng(n, e) {
        return n && n.length ? Er(n, P(e, 2), yi) : o;
      }
      function Wg(n) {
        return Vo(n, Bn);
      }
      function $g(n, e) {
        return Vo(n, P(e, 2));
      }
      function Ug(n) {
        return n && n.length ? Er(n, Bn, Ci) : o;
      }
      function Fg(n, e) {
        return n && n.length ? Er(n, P(e, 2), Ci) : o;
      }
      var Bg = Or(function(n, e) {
        return n * e;
      }, 1), Dg = Ui("round"), Gg = Or(function(n, e) {
        return n - e;
      }, 0);
      function zg(n) {
        return n && n.length ? ai(n, Bn) : 0;
      }
      function Hg(n, e) {
        return n && n.length ? ai(n, P(e, 2)) : 0;
      }
      return u.after = cd, u.ary = ys, u.assign = Qd, u.assignIn = $s, u.assignInWith = Hr, u.assignWith = jd, u.at = np, u.before = Es, u.bind = Xi, u.bindAll = og, u.bindKey = As, u.castArray = Ed, u.chain = ws, u.chunk = Pc, u.compact = Mc, u.concat = Nc, u.cond = ug, u.conforms = sg, u.constant = to, u.countBy = zh, u.create = ep, u.curry = Ts, u.curryRight = Cs, u.debounce = Ss, u.defaults = tp, u.defaultsDeep = rp, u.defer = hd, u.delay = dd, u.difference = Wc, u.differenceBy = $c, u.differenceWith = Uc, u.drop = Fc, u.dropRight = Bc, u.dropRightWhile = Dc, u.dropWhile = Gc, u.fill = zc, u.filter = kh, u.flatMap = Kh, u.flatMapDeep = Zh, u.flatMapDepth = Xh, u.flatten = gs, u.flattenDeep = Hc, u.flattenDepth = kc, u.flip = pd, u.flow = lg, u.flowRight = ag, u.fromPairs = qc, u.functions = ap, u.functionsIn = cp, u.groupBy = Jh, u.initial = Kc, u.intersection = Zc, u.intersectionBy = Xc, u.intersectionWith = Jc, u.invert = dp, u.invertBy = pp, u.invokeMap = Qh, u.iteratee = ro, u.keyBy = jh, u.keys = xn, u.keysIn = Fn, u.map = Ur, u.mapKeys = vp, u.mapValues = _p, u.matches = cg, u.matchesProperty = hg, u.memoize = Br, u.merge = mp, u.mergeWith = Us, u.method = dg, u.methodOf = pg, u.mixin = io, u.negate = Dr, u.nthArg = vg, u.omit = wp, u.omitBy = bp, u.once = gd, u.orderBy = nd, u.over = _g, u.overArgs = vd, u.overEvery = mg, u.overSome = wg, u.partial = Ji, u.partialRight = Rs, u.partition = ed, u.pick = xp, u.pickBy = Fs, u.property = qs, u.propertyOf = bg, u.pull = nh, u.pullAll = _s, u.pullAllBy = eh, u.pullAllWith = th, u.pullAt = rh, u.range = xg, u.rangeRight = yg, u.rearg = _d, u.reject = id, u.remove = ih, u.rest = md, u.reverse = Ki, u.sampleSize = ud, u.set = Ep, u.setWith = Ap, u.shuffle = sd, u.slice = oh, u.sortBy = ad, u.sortedUniq = hh, u.sortedUniqBy = dh, u.split = Kp, u.spread = wd, u.tail = ph, u.take = gh, u.takeRight = vh, u.takeRightWhile = _h, u.takeWhile = mh, u.tap = Mh, u.throttle = bd, u.thru = $r, u.toArray = Ms, u.toPairs = Bs, u.toPairsIn = Ds, u.toPath = Sg, u.toPlainObject = Ws, u.transform = Tp, u.unary = xd, u.union = wh, u.unionBy = bh, u.unionWith = xh, u.uniq = yh, u.uniqBy = Eh, u.uniqWith = Ah, u.unset = Cp, u.unzip = Zi, u.unzipWith = ms, u.update = Sp, u.updateWith = Rp, u.values = Tt, u.valuesIn = Ip, u.without = Th, u.words = Hs, u.wrap = yd, u.xor = Ch, u.xorBy = Sh, u.xorWith = Rh, u.zip = Ih, u.zipObject = Oh, u.zipObjectDeep = Lh, u.zipWith = Ph, u.entries = Bs, u.entriesIn = Ds, u.extend = $s, u.extendWith = Hr, io(u, u), u.add = Ig, u.attempt = ks, u.camelCase = Mp, u.capitalize = Gs, u.ceil = Og, u.clamp = Op, u.clone = Ad, u.cloneDeep = Cd, u.cloneDeepWith = Sd, u.cloneWith = Td, u.conformsTo = Rd, u.deburr = zs, u.defaultTo = fg, u.divide = Lg, u.endsWith = Np, u.eq = ae, u.escape = Wp, u.escapeRegExp = $p, u.every = Hh, u.find = qh, u.findIndex = ds, u.findKey = ip, u.findLast = Yh, u.findLastIndex = ps, u.findLastKey = op, u.floor = Pg, u.forEach = bs, u.forEachRight = xs, u.forIn = up, u.forInRight = sp, u.forOwn = fp, u.forOwnRight = lp, u.get = ji, u.gt = Id, u.gte = Od, u.has = hp, u.hasIn = no, u.head = vs, u.identity = Bn, u.includes = Vh, u.indexOf = Yc, u.inRange = Lp, u.invoke = gp, u.isArguments = at, u.isArray = G, u.isArrayBuffer = Ld, u.isArrayLike = Un, u.isArrayLikeObject = gn, u.isBoolean = Pd, u.isBuffer = Je, u.isDate = Md, u.isElement = Nd, u.isEmpty = Wd, u.isEqual = $d, u.isEqualWith = Ud, u.isError = Vi, u.isFinite = Fd, u.isFunction = Ie, u.isInteger = Is, u.isLength = Gr, u.isMap = Os, u.isMatch = Bd, u.isMatchWith = Dd, u.isNaN = Gd, u.isNative = zd, u.isNil = kd, u.isNull = Hd, u.isNumber = Ls, u.isObject = hn, u.isObjectLike = pn, u.isPlainObject = Yt, u.isRegExp = Qi, u.isSafeInteger = qd, u.isSet = Ps, u.isString = zr, u.isSymbol = kn, u.isTypedArray = At, u.isUndefined = Yd, u.isWeakMap = Kd, u.isWeakSet = Zd, u.join = Vc, u.kebabCase = Up, u.last = re, u.lastIndexOf = Qc, u.lowerCase = Fp, u.lowerFirst = Bp, u.lt = Xd, u.lte = Jd, u.max = Mg, u.maxBy = Ng, u.mean = Wg, u.meanBy = $g, u.min = Ug, u.minBy = Fg, u.stubArray = uo, u.stubFalse = so, u.stubObject = Eg, u.stubString = Ag, u.stubTrue = Tg, u.multiply = Bg, u.nth = jc, u.noConflict = gg, u.noop = oo, u.now = Fr, u.pad = Dp, u.padEnd = Gp, u.padStart = zp, u.parseInt = Hp, u.random = Pp, u.reduce = td, u.reduceRight = rd, u.repeat = kp, u.replace = qp, u.result = yp, u.round = Dg, u.runInContext = d, u.sample = od, u.size = fd, u.snakeCase = Yp, u.some = ld, u.sortedIndex = uh, u.sortedIndexBy = sh, u.sortedIndexOf = fh, u.sortedLastIndex = lh, u.sortedLastIndexBy = ah, u.sortedLastIndexOf = ch, u.startCase = Zp, u.startsWith = Xp, u.subtract = Gg, u.sum = zg, u.sumBy = Hg, u.template = Jp, u.times = Cg, u.toFinite = Oe, u.toInteger = z, u.toLength = Ns, u.toLower = Vp, u.toNumber = ie, u.toSafeInteger = Vd, u.toString = tn, u.toUpper = Qp, u.trim = jp, u.trimEnd = ng, u.trimStart = eg, u.truncate = tg, u.unescape = rg, u.uniqueId = Rg, u.upperCase = ig, u.upperFirst = eo, u.each = bs, u.eachRight = xs, u.first = vs, io(u, function() {
        var n = {};
        return ve(u, function(e, t) {
          rn.call(u.prototype, t) || (n[t] = e);
        }), n;
      }(), { chain: !1 }), u.VERSION = g, Qn(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n) {
        u[n].placeholder = u;
      }), Qn(["drop", "take"], function(n, e) {
        X.prototype[n] = function(t) {
          t = t === o ? 1 : bn(z(t), 0);
          var r = this.__filtered__ && !e ? new X(this) : this.clone();
          return r.__filtered__ ? r.__takeCount__ = Rn(t, r.__takeCount__) : r.__views__.push({
            size: Rn(t, on),
            type: n + (r.__dir__ < 0 ? "Right" : "")
          }), r;
        }, X.prototype[n + "Right"] = function(t) {
          return this.reverse()[n](t).reverse();
        };
      }), Qn(["filter", "map", "takeWhile"], function(n, e) {
        var t = e + 1, r = t == ue || t == $e;
        X.prototype[n] = function(i) {
          var s = this.clone();
          return s.__iteratees__.push({
            iteratee: P(i, 3),
            type: t
          }), s.__filtered__ = s.__filtered__ || r, s;
        };
      }), Qn(["head", "last"], function(n, e) {
        var t = "take" + (e ? "Right" : "");
        X.prototype[n] = function() {
          return this[t](1).value()[0];
        };
      }), Qn(["initial", "tail"], function(n, e) {
        var t = "drop" + (e ? "" : "Right");
        X.prototype[n] = function() {
          return this.__filtered__ ? new X(this) : this[t](1);
        };
      }), X.prototype.compact = function() {
        return this.filter(Bn);
      }, X.prototype.find = function(n) {
        return this.filter(n).head();
      }, X.prototype.findLast = function(n) {
        return this.reverse().find(n);
      }, X.prototype.invokeMap = q(function(n, e) {
        return typeof n == "function" ? new X(this) : this.map(function(t) {
          return Dt(t, n, e);
        });
      }), X.prototype.reject = function(n) {
        return this.filter(Dr(P(n)));
      }, X.prototype.slice = function(n, e) {
        n = z(n);
        var t = this;
        return t.__filtered__ && (n > 0 || e < 0) ? new X(t) : (n < 0 ? t = t.takeRight(-n) : n && (t = t.drop(n)), e !== o && (e = z(e), t = e < 0 ? t.dropRight(-e) : t.take(e - n)), t);
      }, X.prototype.takeRightWhile = function(n) {
        return this.reverse().takeWhile(n).reverse();
      }, X.prototype.toArray = function() {
        return this.take(on);
      }, ve(X.prototype, function(n, e) {
        var t = /^(?:filter|find|map|reject)|While$/.test(e), r = /^(?:head|last)$/.test(e), i = u[r ? "take" + (e == "last" ? "Right" : "") : e], s = r || /^find/.test(e);
        i && (u.prototype[e] = function() {
          var f = this.__wrapped__, a = r ? [1] : arguments, p = f instanceof X, w = a[0], b = p || G(f), y = function(K) {
            var J = i.apply(u, He([K], a));
            return r && T ? J[0] : J;
          };
          b && t && typeof w == "function" && w.length != 1 && (p = b = !1);
          var T = this.__chain__, O = !!this.__actions__.length, N = s && !T, k = p && !O;
          if (!s && b) {
            f = k ? f : new X(this);
            var W = n.apply(f, a);
            return W.__actions__.push({ func: $r, args: [y], thisArg: o }), new ne(W, T);
          }
          return N && k ? n.apply(this, a) : (W = this.thru(y), N ? r ? W.value()[0] : W.value() : W);
        });
      }), Qn(["pop", "push", "shift", "sort", "splice", "unshift"], function(n) {
        var e = fr[n], t = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(n);
        u.prototype[n] = function() {
          var i = arguments;
          if (r && !this.__chain__) {
            var s = this.value();
            return e.apply(G(s) ? s : [], i);
          }
          return this[t](function(f) {
            return e.apply(G(f) ? f : [], i);
          });
        };
      }), ve(X.prototype, function(n, e) {
        var t = u[e];
        if (t) {
          var r = t.name + "";
          rn.call(wt, r) || (wt[r] = []), wt[r].push({ name: e, func: t });
        }
      }), wt[Ir(o, nn).name] = [{
        name: "wrapper",
        func: o
      }], X.prototype.clone = ra, X.prototype.reverse = ia, X.prototype.value = oa, u.prototype.at = Nh, u.prototype.chain = Wh, u.prototype.commit = $h, u.prototype.next = Uh, u.prototype.plant = Bh, u.prototype.reverse = Dh, u.prototype.toJSON = u.prototype.valueOf = u.prototype.value = Gh, u.prototype.first = u.prototype.head, Mt && (u.prototype[Mt] = Fh), u;
    }, vt = $l();
    tt ? ((tt.exports = vt)._ = vt, ri._ = vt) : An._ = vt;
  }).call(Xt);
})(kr, kr.exports);
var Rv = kr.exports;
const Kv = (l, h = "de-DE") => new Date(l).toLocaleDateString(h, {
  day: "2-digit",
  month: "long",
  year: "numeric"
}), Zv = (l, h = "de-DE") => new Date(l).toLocaleDateString(h, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}), Xv = (l, h = "EUR", o = "de-DE") => new Intl.NumberFormat(o, {
  style: "currency",
  currency: h
}).format(l), Jv = (l, h, o, g = {}) => {
  const x = (g == null ? void 0 : g.lineDivider) || `,
`;
  return Rv.isObject(x) ? /* @__PURE__ */ ho.jsxs(ho.Fragment, { children: [
    l,
    x,
    o,
    " ",
    h
  ] }) : `${l}${x}${o} ${h}`;
}, Vv = (l, h = {}, o = "de-DE") => new Intl.NumberFormat(o, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  ...h
}).format(l), Qv = (l) => {
  l = new Date(l);
  const h = /* @__PURE__ */ new Date(), o = h.getFullYear() - l.getFullYear(), g = h.getMonth() - l.getMonth();
  return g < 0 || g === 0 && h.getDate() < l.getDate() ? o - 1 : o;
};
var ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.TokenData = void 0;
ct.parse = vo;
var Iv = ct.compile = Nv;
ct.match = Uv;
ct.pathToRegexp = af;
const sf = "/", go = (l) => l, Ov = new RegExp("^\\p{XID_Continue}$", "u"), Qt = "https://git.new/pathToRegexpError", Lv = {
  "!": "!",
  "@": "@",
  ";": ";",
  ",": ",",
  "*": "*",
  "+": "+",
  "?": "?",
  "{": "{",
  "}": "}"
};
function Pv(l) {
  const h = [...l], o = [];
  let g = 0;
  for (; g < h.length; ) {
    const x = h[g], m = Lv[x];
    if (m) {
      o.push({ type: m, index: g++, value: x });
      continue;
    }
    if (x === "\\") {
      o.push({ type: "ESCAPED", index: g++, value: h[g++] });
      continue;
    }
    if (x === ":") {
      let E = "";
      for (; Ov.test(h[++g]); )
        E += h[g];
      if (!E)
        throw new TypeError(`Missing parameter name at ${g}`);
      o.push({ type: "NAME", index: g, value: E });
      continue;
    }
    if (x === "(") {
      const E = g++;
      let A = 1, S = "";
      if (h[g] === "?")
        throw new TypeError(`Pattern cannot start with "?" at ${g}`);
      for (; g < h.length; ) {
        if (h[g] === "\\") {
          S += h[g++] + h[g++];
          continue;
        }
        if (h[g] === ")") {
          if (A--, A === 0) {
            g++;
            break;
          }
        } else if (h[g] === "(" && (A++, h[g + 1] !== "?"))
          throw new TypeError(`Capturing groups are not allowed at ${g}`);
        S += h[g++];
      }
      if (A)
        throw new TypeError(`Unbalanced pattern at ${E}`);
      if (!S)
        throw new TypeError(`Missing pattern at ${E}`);
      o.push({ type: "PATTERN", index: g, value: S });
      continue;
    }
    o.push({ type: "CHAR", index: g, value: h[g++] });
  }
  return o.push({ type: "END", index: g, value: "" }), new Mv(o);
}
class Mv {
  constructor(h) {
    this.tokens = h, this.index = 0;
  }
  peek() {
    return this.tokens[this.index];
  }
  tryConsume(h) {
    const o = this.peek();
    if (o.type === h)
      return this.index++, o.value;
  }
  consume(h) {
    const o = this.tryConsume(h);
    if (o !== void 0)
      return o;
    const { type: g, index: x } = this.peek();
    throw new TypeError(`Unexpected ${g} at ${x}, expected ${h}: ${Qt}`);
  }
  text() {
    let h = "", o;
    for (; o = this.tryConsume("CHAR") || this.tryConsume("ESCAPED"); )
      h += o;
    return h;
  }
  modifier() {
    return this.tryConsume("?") || this.tryConsume("*") || this.tryConsume("+");
  }
}
class qr {
  constructor(h, o) {
    this.tokens = h, this.delimiter = o;
  }
}
ct.TokenData = qr;
function vo(l, h = {}) {
  const { encodePath: o = go, delimiter: g = o(sf) } = h, x = [], m = Pv(l);
  let E = 0;
  do {
    const A = m.text();
    A && x.push(o(A));
    const S = m.tryConsume("NAME"), U = m.tryConsume("PATTERN");
    if (S || U) {
      x.push({
        name: S || String(E++),
        pattern: U
      });
      const M = m.peek();
      if (M.type === "*")
        throw new TypeError(`Unexpected * at ${M.index}, you probably want \`/*\` or \`{/:foo}*\`: ${Qt}`);
      continue;
    }
    if (m.tryConsume("*")) {
      x.push({
        name: String(E++),
        pattern: `(?:(?!${St(g)}).)*`,
        modifier: "*",
        separator: g
      });
      continue;
    }
    if (m.tryConsume("{")) {
      const M = m.text(), V = m.tryConsume("NAME"), Z = m.tryConsume("PATTERN"), Y = m.text(), B = m.tryConsume(";") && m.text();
      m.consume("}");
      const nn = m.modifier();
      x.push({
        name: V || (Z ? String(E++) : ""),
        prefix: o(M),
        suffix: o(Y),
        pattern: Z,
        modifier: nn,
        separator: B
      });
      continue;
    }
    m.consume("END");
    break;
  } while (!0);
  return new qr(x, g);
}
function Nv(l, h = {}) {
  const o = l instanceof qr ? l : vo(l, h);
  return $v(o, h);
}
function Wv(l, h) {
  if (typeof l == "string")
    return () => l;
  const o = h || go, g = l.modifier === "+" || l.modifier === "*", x = l.modifier === "?" || l.modifier === "*", { prefix: m = "", suffix: E = "", separator: A = E + m } = l;
  if (h && g) {
    const U = ($, M) => {
      if (typeof $ != "string")
        throw new TypeError(`Expected "${l.name}/${M}" to be a string`);
      return o($);
    }, L = ($) => {
      if (!Array.isArray($))
        throw new TypeError(`Expected "${l.name}" to be an array`);
      return $.length === 0 ? "" : m + $.map(U).join(A) + E;
    };
    return x ? ($) => {
      const M = $[l.name];
      return M == null ? "" : M.length ? L(M) : "";
    } : ($) => {
      const M = $[l.name];
      return L(M);
    };
  }
  const S = (U) => {
    if (typeof U != "string")
      throw new TypeError(`Expected "${l.name}" to be a string`);
    return m + o(U) + E;
  };
  return x ? (U) => {
    const L = U[l.name];
    return L == null ? "" : S(L);
  } : (U) => {
    const L = U[l.name];
    return S(L);
  };
}
function $v(l, h) {
  const { encode: o = encodeURIComponent, loose: g = !0, validate: x = !0, strict: m = !1 } = h, E = ff(h), A = _o(g, l.delimiter), S = lf(l, A, [], E, m), U = l.tokens.map((L, $) => {
    const M = Wv(L, o);
    if (!x || typeof L == "string")
      return M;
    const V = new RegExp(`^${S[$]}$`, E);
    return (Z) => {
      const Y = M(Z);
      if (!V.test(Y))
        throw new TypeError(`Invalid value for "${L.name}": ${JSON.stringify(Y)}`);
      return Y;
    };
  });
  return function($ = {}) {
    let M = "";
    for (const V of U)
      M += V($);
    return M;
  };
}
function Uv(l, h = {}) {
  const { decode: o = decodeURIComponent, loose: g = !0, delimiter: x = sf } = h, m = af(l, h), E = _o(g, x), A = m.keys.map((S) => {
    if (o && (S.modifier === "+" || S.modifier === "*")) {
      const { prefix: U = "", suffix: L = "", separator: $ = L + U } = S, M = new RegExp(E($), "g");
      return (V) => V.split(M).map(o);
    }
    return o || go;
  });
  return function(U) {
    const L = m.exec(U);
    if (!L)
      return !1;
    const { 0: $, index: M } = L, V = /* @__PURE__ */ Object.create(null);
    for (let Z = 1; Z < L.length; Z++) {
      if (L[Z] === void 0)
        continue;
      const Y = m.keys[Z - 1], B = A[Z - 1];
      V[Y.name] = B(L[Z]);
    }
    return { path: $, index: M, params: V };
  };
}
function St(l) {
  return l.replace(/[.+*?^${}()[\]|/\\]/g, "\\$&");
}
function Fv(l, h) {
  const o = St(l);
  return h ? `(?:${o})+(?!${o})` : o;
}
function _o(l, h) {
  if (!l)
    return St;
  const o = new RegExp(`(?:(?!${St(h)}).)+|(.)`, "g");
  return (g) => g.replace(o, Fv);
}
function ff(l) {
  return l.sensitive ? "" : "i";
}
function Qs(l, h, o, g) {
  const x = l instanceof qr ? l : vo(l, g), { trailing: m = !0, loose: E = !0, start: A = !0, end: S = !0, strict: U = !1 } = g, L = _o(E, x.delimiter), $ = lf(x, L, h, o, U);
  let M = A ? "^" : "";
  return M += $.join(""), m && (M += `(?:${L(x.delimiter)}$)?`), M += S ? "$" : `(?=${St(x.delimiter)}|$)`, M;
}
function lf(l, h, o, g, x) {
  const m = `(?:(?!${St(l.delimiter)}).)+?`;
  let E = "", A = !0;
  return l.tokens.map((S) => {
    if (typeof S == "string")
      return E = S, h(S);
    const { prefix: U = "", suffix: L = "", separator: $ = L + U, modifier: M = "" } = S, V = h(U), Z = h(L);
    if (S.name) {
      const Y = S.pattern ? `(?:${S.pattern})` : m, B = Bv(Y, S.name, g);
      if (A || (A = lo(B, U || E)), !A)
        throw new TypeError(`Ambiguous pattern for "${S.name}": ${Qt}`);
      if (A = !x || lo(B, L), E = "", o.push(S), M === "+" || M === "*") {
        const nn = M === "*" ? "?" : "", _n = h($);
        if (!_n)
          throw new TypeError(`Missing separator for "${S.name}": ${Qt}`);
        if (A || (A = !x || lo(B, $)), !A)
          throw new TypeError(`Ambiguous pattern for "${S.name}" separator: ${Qt}`);
        return A = !x, `(?:${V}(${Y}(?:${_n}${Y})*)${Z})${nn}`;
      }
      return `(?:${V}(${Y})${Z})${M}`;
    }
    return `(?:${V}${Z})${M}`;
  });
}
function Bv(l, h, o) {
  try {
    return new RegExp(`^${l}$`, o);
  } catch (g) {
    throw new TypeError(`Invalid pattern for "${h}": ${g.message}`);
  }
}
function lo(l, h) {
  return h ? !l.test(h) : !1;
}
function af(l, h = {}) {
  const o = [], g = ff(h);
  if (Array.isArray(l)) {
    const m = l.map((E) => Qs(E, o, g, h));
    return Object.assign(new RegExp(m.join("|")), { keys: o });
  }
  const x = Qs(l, o, g, h);
  return Object.assign(new RegExp(x), { keys: o });
}
const jv = (l, h = {}) => Iv(l, { encode: encodeURIComponent })(h), Dv = (l) => [() => {
  const g = document.querySelector(`meta[name="${l}"]`);
  return (g == null ? void 0 : g.getAttribute("content")) || "";
}, (g) => {
  const x = document.querySelector(`meta[name="${l}"]`);
  if (x)
    x.setAttribute("content", g);
  else {
    const m = document.createElement("meta");
    m.name = l, m.content = g, document.head.appendChild(m);
  }
}], Gv = () => [() => {
  const o = document.querySelector("title");
  return (o == null ? void 0 : o.innerHTML) || document.title || "";
}, (o) => {
  const g = document.querySelector("title");
  if (g)
    g.innerHTML = o;
  else {
    const x = document.createElement("title");
    x.innerHTML = o, document.head.appendChild(x);
  }
  document.title = o;
}], n_ = ({
  title: l,
  themeColor: h,
  children: o,
  isLoading: g = !1,
  fallback: x
  // used when it is loading
}) => {
  const [, m] = Dv("theme-color"), [, E] = Gv();
  return Ks(() => {
    l != null && E(l);
  }, [l]), Ks(() => {
    h != null && (m(h || "#ffffff"), document.body.style.backgroundColor = h || "");
  }, [h]), g ? x || null : o;
}, e_ = ({
  component: l,
  ...h
}) => /* @__PURE__ */ ho.jsx(l, { ...h });
export {
  e_ as Dynamic,
  n_ as Page,
  Av as classnames,
  Jv as formatAddress,
  Qv as formatAge,
  Kv as formatDate,
  Zv as formatDateShort,
  Vv as formatDecimal,
  Xv as formatMoney,
  kv as mergeEventHandlers,
  Hv as mergeProps,
  Tv as mergeRefs,
  jv as url,
  qv as useControllableState,
  Yv as useLocalStorage
};
