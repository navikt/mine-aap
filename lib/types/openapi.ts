export type RequestBody<Operation> = NonNullable<
  Extract<Operation, { requestBody?: { content: { 'application/json': unknown } } }>['requestBody']
>['content']['application/json'];

export type ResponseBody<Operation> = Extract<
  Operation,
  { responses: { 200: { content: { 'application/json': unknown } } } }
>['responses'][200]['content']['application/json'];
