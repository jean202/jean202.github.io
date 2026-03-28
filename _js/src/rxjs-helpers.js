export function op(operator, ...args) {
  return source => operator.call(source, ...args);
}

export function pipe(source, ...operations) {
  return operations.reduce((current, operation) => operation(current), source);
}
