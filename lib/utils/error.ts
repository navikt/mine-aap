export function errorHasStatus(err: unknown): err is { status: number } {
  return err instanceof Object && Object.hasOwn(err, 'status');
}
export function errorHasMessage(err: unknown): err is { message: string } {
  return err instanceof Object && Object.hasOwn(err, 'message');
}
