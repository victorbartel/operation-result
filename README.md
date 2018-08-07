# operation-result
A very basic result wrapper for JS/TS based projects. It works like an `Optional` type in Scala, but in the same time it remains more business oriented.

Usage example:

```typescript
const result = Promise.resolve(1).then(success).catch(failure);
```
Or
```typescript
if (isUnsuccessful(result)) {
    const message = `Impossible to proceed: ${result.reason}`;
    return abort(message);
}
return result;
```
