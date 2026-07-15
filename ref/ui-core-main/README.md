# @opkle/ui-core

Vanilla TypeScript UI core and DOM utility layer extracted from Opkle editor.

Opkle is a software company building advanced ebook and web-content authoring tools. Its main product, Opkle editor, is a browser-based editor for creating EPUB and rich web documents with layout control, animation, media handling, local data workflows, and AI-assisted editing.

@opkle/ui-core is the public, framework-independent frontend core extracted from that editor runtime. It is not a marketing demo, a component skin, or a thin wrapper around another framework. It is a small TypeScript utility layer for building complex browser interfaces in a direct, object-oriented, event-driven style.

The representative production website built with the same design philosophy is https://opkle.app.

## Why This Exists

Many frontend frameworks are optimized around declarative component trees and repeated rendering. That model is excellent for many products, but complex editors often have a different shape:

- many small DOM nodes are created, moved, measured, styled, and removed directly;
- pointer, keyboard, hover, touch, drag, resize, and document events overlap;
- state often lives in editor objects, local storage, IndexedDB, documents, timelines, canvases, or worker pipelines;
- UI behavior is frequently procedural: create this node, attach these events, insert this child, update this style, continue the workflow.

@opkle/ui-core is designed for that kind of application. It lets frontend code read more like backend application logic: a clear sequence of operations, object methods, event handlers, and explicit data flow. For editor-class software, this can be easier to reason about than forcing every interaction through a component re-render model.

The goal is not to replace React, Vue, Svelte, or any other framework for every use case. The goal is to provide a compact vanilla TypeScript foundation for interfaces where direct DOM control, event composition, and OOP-style organization are strengths.

## Core Idea

The central API is a command-object based DOM builder.

Instead of writing scattered DOM calls:

```ts
const box = document.createElement("div");
box.classList.add("notice");
box.style.display = "flex";
box.style.padding = "12px";
box.textContent = "Saved";
box.addEventListener("click", onClick);
document.body.appendChild(box);
```

you describe the node as a single object:

```ts
import AbstractNode from "@opkle/ui-core";

const box = AbstractNode.createDom({
  mother: document.body,
  mode: "div",
  class: [ "notice" ],
  text: "Saved",
  style: {
    padding: 12,
    borderRadius: 6,
    background: "#f7f7f7",
  },
  event: {
    click: () => {
      console.log("clicked");
    },
  },
});
```

That command object can include children, styles, events, attributes, insertion position, text formatting helpers, SVG creation, and chained sibling creation. This is the style Opkle uses for complex editor surfaces where UI construction is part of the application logic.

## Features

### Object-Oriented Frontend Flow

@opkle/ui-core works well when your frontend is organized around classes and domain objects:

```ts
class InspectorPanel {
  public root: HTMLElement;

  constructor(mother: HTMLElement) {
    this.root = AbstractNode.createDom({
      mother,
      mode: "section",
      class: [ "inspector-panel" ],
      style: {
        width: 320,
        height: "100%",
        background: "#ffffff",
      },
      children: [
        {
          mode: "h2",
          text: "Inspector",
          style: {
            fontSizeWeight: [ 16, 700 ],
          },
        },
      ],
    });
  }
}
```

The code follows the same rhythm as backend or Node.js logic: construct an object, create resources, attach event behavior, and expose methods. This is especially useful when the UI is not just a view of state, but an active editing surface.

### Direct DOM Creation With Sensible Defaults

createDom applies practical defaults for application UI:

- default display is flex;
- default position is relative;
- flex containers default to column direction;
- transform origin is normalized;
- numeric style values become pixel values where appropriate;
- pure numeric CSS properties such as opacity and zIndex stay unitless;
- image nodes receive a fallback alt attribute;
- textareas default to spellcheck=false.

It also caches the first created element for each tag name and clones it for later calls, avoiding repeated fresh createElement calls for common node types.

### Command Object Children

Nested UI can be created in one flow:

```ts
AbstractNode.createDom({
  mother: document.body,
  mode: "div",
  class: [ "toolbar" ],
  children: [
    {
      mode: "button",
      text: "Undo",
      event: {
        click: undo,
      },
    },
    {
      mode: "button",
      text: "Redo",
      event: {
        click: redo,
      },
    },
  ],
});
```

This is intentionally simple. It does not introduce a virtual DOM, lifecycle system, compiler, JSX transform, or runtime scheduler. The result is the actual DOM node.

### Mixing DOM And SVG Children

createNode automatically routes a command with mode: "svg" to createSvg. That means SVG icons can be placed inside ordinary DOM children without switching mental models:

```ts
const closeIcon = "<svg viewBox='0 0 24 24'><path d='M6 6L18 18M18 6L6 18' /></svg>";

AbstractNode.createDom({
  mother: document.body,
  mode: "button",
  class: [ "icon-button" ],
  style: {
    widthHeight: [ 40, 40 ],
    alignItems: "center",
    justifyContent: "center",
  },
  children: [
    {
      mode: "svg",
      source: closeIcon,
      attribute: {
        "aria-hidden": "true",
      },
      style: {
        width: 18,
        height: 18,
        stroke: "currentColor",
        fill: "none",
      },
    },
  ],
  event: {
    click: closePanel,
  },
});
```

For a single child, you can use child. For multiple children, use children:

```ts
AbstractNode.createDom({
  mother: document.body,
  mode: "label",
  child: {
    mode: "input",
    attribute: {
      type: "checkbox",
      checked: "true",
    },
    event: {
      change: toggleOption,
    },
  },
});
```

### Event-Oriented UI Logic

The event map is built for rich interfaces:

```ts
AbstractNode.createDom({
  mother: document.body,
  mode: "button",
  text: "Open",
  event: {
    click: openPanel,
    hover: highlightButton,
    "keydown$keyup": syncShortcutState,
  },
});
```

Notable event behavior:

- click handlers automatically get pointer cursor styling when no cursor is provided;
- hover stores the original style and restores it on mouseleave;
- touch is normalized for iOS-like pointer behavior;
- multiple events can be bound with a $ separated event key.

This event-first model is one of the main reasons @opkle/ui-core fits editor UI. Complex editors are often closer to event systems than page templates.

### Attributes, Inputs, And Form Controls

Attributes are set with the attribute object. This keeps element creation, configuration, and event wiring together:

```ts
const emailInput = AbstractNode.createDom({
  mother: document.body,
  mode: "input",
  class: [ "email-input" ],
  attribute: {
    type: "email",
    name: "email",
    placeholder: "you@example.com",
    autocomplete: "email",
    value: "",
    "aria-label": "Email address",
  },
  style: {
    width: 320,
    height: 42,
    padding: "0 12px",
    border: "1px solid #dddddd",
    borderRadius: 6,
  },
  event: {
    focus: (event) => {
      const input = event.currentTarget as HTMLInputElement;
      input.style.borderColor = "#006bd2";
    },
    blur: (event) => {
      const input = event.currentTarget as HTMLInputElement;
      input.style.borderColor = "#dddddd";
    },
    keyup: (event) => {
      const input = event.currentTarget as HTMLInputElement;
      console.log(input.value);
    },
  },
}) as HTMLInputElement;
```

Input type is just an attribute, so the same pattern works for text, email, password, number, search, checkbox, radio, range, file, date, color, and other native input types.

Buttons, inputs, and panels can be wired in the same command flow:

```ts
AbstractNode.createDom({
  mother: document.body,
  mode: "div",
  class: [ "login-row" ],
  children: [
    {
      mode: "input",
      attribute: {
        type: "password",
        placeholder: "Password",
      },
      event: {
        keyup: validatePassword,
        focus: openPasswordHelp,
        blur: closePasswordHelp,
      },
    },
    {
      mode: "button",
      text: "Sign in",
      attribute: {
        type: "button",
      },
      event: {
        click: submitLogin,
      },
    },
  ],
});
```

This is a small detail, but it is important for editor and tool interfaces: DOM shape, attributes, and behavior can stay in one readable object instead of being split across templates, refs, effects, and separate event binding code.

### Style Shorthands For Dense UI Code

The style object supports practical shortcuts:

```ts
AbstractNode.createDom({
  mother: document.body,
  mode: "div",
  text: "Title",
  style: {
    widthHeight: [ 240, 48 ],
    fontSizeWeight: [ 18, 700 ],
    fontColor: "#303030",
    textGradient: "linear-gradient(90deg, #006bd2, #2fa678)",
  },
});
```

Supported patterns include:

- widthHeight: set width and height together;
- fontSizeWeight: set font-size and font-weight together;
- fontColor: alias for color;
- textGradient: background-clipped gradient text;
- automatic camelCase to CSS property handling;
- numeric-to-unit conversion using the current unit system.

### Inline Text Formatting Helpers

createDom can apply inline formatting markers inside text while keeping the surrounding node creation in one command object. It supports separate style objects for bold, italic, underline, strike, code, reference, special, and anchor-like text regions.

This is useful in editor surfaces where generated UI labels, notices, or document-related controls need small pieces of styled inline text without manually building many nested nodes.

### SVG Utilities

@opkle/ui-core includes lightweight SVG helpers:

```ts
import AbstractNode, { SvgTong } from "@opkle/ui-core";

const icon = SvgTong.stringParsing("<svg viewBox='0 0 24 24'></svg>");
const ratio = icon.getRatio();
```

createSvg works with the same command-object style as createDom, so SVG nodes can be styled, attributed, and inserted with a similar flow:

```ts
const arrowSource = "<svg viewBox='0 0 24 24'><path d='M5 12H19M13 6L19 12L13 18' /></svg>";

const arrow = AbstractNode.createSvg({
  mother: document.body,
  mode: "svg",
  source: arrowSource,
  class: [ "arrow-icon" ],
  attribute: {
    role: "img",
    "aria-label": "Next",
  },
  style: {
    width: 24,
    height: 24,
    stroke: "#303030",
    fill: "none",
  },
  event: {
    click: goNext,
    hover: (event) => {
      const svg = event.currentTarget as SVGElement;
      svg.style.stroke = "#006bd2";
    },
  },
});

document.body.appendChild(arrow.source);
```

When SVG is used inside children, createNode handles the createSvg branch for you. When you need the SvgDom wrapper directly, call createSvg.

### Responsive Value Helpers

The package includes media helpers for choosing values by viewport width:

```ts
const gap = AbstractNode.mediaNumber(32, 28, 24, 18, 12);
const width = AbstractNode.mediaString("1280px", "1024px", "900px", "720px", "100%");
```

This keeps responsive application code close to the logic that uses it.

### Utility Surface

The public API also includes:

- sleep for async workflow timing;
- setThrottle for event throttling;
- cssCalc for CSS calc expressions;
- pixelUnit and eaUnit helpers;
- MIME type maps and reverse lookup;
- a shared color token dictionary;
- SVG string makers for common icon shapes.

## When To Use It

Use @opkle/ui-core when you are building:

- browser-based editors;
- document tools;
- ebook or web-content authoring interfaces;
- animation or media-heavy tools;
- local-first web apps;
- UI systems where direct DOM control is a feature, not a problem;
- TypeScript applications organized around classes, modules, and explicit event flows.

It is probably not the first choice if you want a declarative component framework, server components, JSX-first rendering, or a large ecosystem of ready-made UI components.

## Relationship To Opkle Editor

Opkle editor is a production editor for EPUB and web-content workflows. It includes local document handling, rich layout editing, media insertion, animation features, AI-assisted text work, and publishing-oriented utilities.

@opkle/ui-core is the small public core extracted from that larger internal system. Business logic, private editor modules, server integration, and Opkle-specific application code are not included. The package is focused on reusable frontend primitives.

## Installation

```sh
npm install @opkle/ui-core
```

## Basic Usage

```ts
import AbstractNode from "@opkle/ui-core";

const app = AbstractNode.createDom({
  mother: document.body,
  mode: "main",
  class: [ "app" ],
  style: {
    width: "100%",
    minHeight: "100vh",
    padding: 24,
    background: "#ffffff",
  },
  children: [
    {
      mode: "h1",
      text: "Opkle UI Core",
      style: {
        fontSizeWeight: [ 28, 800 ],
        margin: 0,
      },
    },
    {
      mode: "p",
      text: "Build complex frontend tools with direct DOM control.",
      style: {
        marginTop: 12,
        fontSize: 16,
        color: "#404040",
      },
    },
  ],
});
```

## Exports

```ts
import AbstractNode, { AbstractNode as NamedAbstractNode, SvgTong, SvgDom } from "@opkle/ui-core";
import type { DomCommand, DomStyle } from "@opkle/ui-core/publicDictionary";
```

## Status

This package is being prepared as the public UI core of Opkle's frontend tooling. The API is intentionally small and focused. More examples and documentation will be added as the open-source project grows.

## License

MIT
