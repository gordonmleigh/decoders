# @gordonmleigh/decoders

Lightweight, composable validation and serialization library.

👉 [Documentation](https://gordonmleigh.github.io/decoders)

## What's it for?

Typescript lets you check your own code and nothing more. This library lets you check data flowing in and out of code that is under your control.

## Show me the code!

The following code creates a validator for an object then prints the results of a validation.

```typescript
const myModel = object({
  greeting: text,
  name: text,
  age: optional(integer),
});

const result = myModel(getValueFromSomewhere());

if (result.ok) {
  console.log(value);
} else {
  console.error(result.error);
}
```

## Influences

This project is the evolution of a library I've been using for a few years in my personal and commercial projects.

The design of this project has been influenced by the [decoders package](https://www.npmjs.com/package/decoders) which I discovered early in the build. I considered abandoning this project in favour of the latter, but I decided I wanted to build a TypeScript implementation.
