export function clamp(value, minimum, maximum) {
  if (value < minimum) {
    value = minimum;
  }

  if (value > maximum) {
    value = maximum;
  }

  return value;
}
