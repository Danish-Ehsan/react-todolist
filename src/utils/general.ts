export function createId(): number {
  return parseInt(Date.now().toString() + ( Math.floor(Math.random() * 999 + 1000).toString() ));
}