export function createId(): number {
  return parseInt( Date.now().toString() + (Math.floor(Math.random() * 100000)).toString() );
}