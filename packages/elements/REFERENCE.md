# Elements SDK API Reference

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Elements Reference](#elements-reference)
  - [mount()](#mount)
  - [unmount()](#unmount)
  - [element(elementType, [options])](#elementelementtype-options)
  - [<ElementsProvider>](#elementsprovider)
  - [<ElementsContainer>](#elementscontainer)
  - [<\*Element>](#%5Celement)
  - [injectClearGDPR (HOC)](#injectcleargdpr-hoc)
- [Component reference](#component-reference)
  - [Consent flow (signup and login)](#consent-flow-signup-and-login)
  - [Right to data portability (exporting and sharing data)](#right-to-data-portability-exporting-and-sharing-data)
  - [Right to data erasue (request to be forgotten)](#right-to-data-erasue-request-to-be-forgotten)
  - [Right to rectification of data](#right-to-rectification-of-data)
  - [Right to restriction of processing](#right-to-restriction-of-processing)
  - [Right to objection of processing](#right-to-objection-of-processing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Elements Reference

### mount()

### unmount()

### element(elementType, [options])

### <ElementsProvider>

### <ElementsContainer>

### <\*Element>

### injectClearGDPR (HOC)

## Component reference

### Consent flow (signup and login)

**Example**

```js
// Alternative 1
Elements.element('consent', { ...options });

// Alternative 2
<Element source="consent" {...options} />

// Alternative 3
<ConsentElement {...options} />
```

**Properties**

- `source`: Should be **consent**
- `options`: Configuration object

| **Name**            | **Description**                                       | **Type**  |            |
| ------------------- | ----------------------------------------------------- | --------- | ---------- |
| `styles`            | Allow to override styling of the component            | `Object`  | _Optional_ |
| `label`             | Define the label of the component                     | `String`  | _Optional_ |
| `required`          | Define if the component is required in the form       | `Boolean` | _Optional_ |
| `onSuccessCallback` | After the form is submitted this callback is executed |           | _Optional_ |

### Right to data portability (exporting and sharing data)

**Example**

```js
// Alternative 1
Elements.element('export', { ...options });

// Alternative 2
<Element source="export" {...options} />

// Alternative 3
<ExportElement {...options} />
```

**Properties**

- `source`: Should be **export**
- `options`: Configuration object

| **Name** | **Description**                            | **Type** |            |
| -------- | ------------------------------------------ | -------- | ---------- |
| `styles` | Allow to override styling of the component | `Object` | _Optional_ |
| `label`  | Define the label of the component          | `String` | _Optional_ |

### Right to data erasue (request to be forgotten)

**Example**

```js
// Alternative 1
Elements.element('forgotten', { ...options });

// Alternative 2
<Element source="forgotten" {...options} />

// Alternative 3
<ForgottenElement {...options} />
```

**Properties**

- `source`: Should be **forgotten**
- `options`: Configuration object

| **Name** | **Description**                            | **Type** |            |
| -------- | ------------------------------------------ | -------- | ---------- |
| `styles` | Allow to override styling of the component | `Object` | _Optional_ |
| `label`  | Define the label of the component          | `String` | _Optional_ |

### Right to rectification of data

**Example**

```js
// Alternative 1
Elements.element('rectification', { ...options });

// Alternative 2
<Element source="rectification" {...options} />

// Alternative 3
<RectificationElement {...options} />
```

**Properties**

- `source`: Should be **rectification**
- `options`: Configuration object

| **Name** | **Description**                            | **Type** |            |
| -------- | ------------------------------------------ | -------- | ---------- |
| `styles` | Allow to override styling of the component | `Object` | _Optional_ |
| `label`  | Define the label of the component          | `String` | _Optional_ |

### Right to restriction of processing

**Example**

```js
// Alternative 1
Elements.element('restriction', { ...options });

// Alternative 2
<Element source="restriction" {...options} />

// Alternative 3
<RestrictionElement {...options} />
```

**Properties**

- `source`: Should be **restriction**
- `options`: Configuration object

| **Name** | **Description**                            | **Type** |            |
| -------- | ------------------------------------------ | -------- | ---------- |
| `styles` | Allow to override styling of the component | `Object` | _Optional_ |
| `label`  | Define the label of the component          | `String` | _Optional_ |

### Right to objection of processing

**Example**

```js
// Alternative 1
Elements.element('objection', { ...options });

// Alternative 2
<Element source="objection" {...options} />

// Alternative 3
<ObjectionElement {...options} />
```

**Properties**

- `source`: Should be **objection**
- `options`: Configuration object

| **Name** | **Description**                            | **Type** |            |
| -------- | ------------------------------------------ | -------- | ---------- |
| `styles` | Allow to override styling of the component | `Object` | _Optional_ |
| `label`  | Define the label of the component          | `String` | _Optional_ |
