type WithMiddleware = <F extends (...args: any[]) => void>(next: F) => (...args: Parameters<F>) => void
type WithMiddlewareAsync = <F extends (...args: any[]) =>
Promise<void>>(next: F) => (...args: Parameters<F>) => Promise<void>;

const noMiddleware: WithMiddleware = (next) => {
  return (...args: Parameters<typeof next>) => {
    next(...args);
  };
};

const noMiddlewareAsync: WithMiddlewareAsync = (next) => {
  const closure = async (...args: Parameters<typeof next>): Promise<void> => {
    await next(...args);
  };

  return closure;
};

type WithMiddlewareCreator = (
  validator: () => boolean,
  onError: () => void,
) => WithMiddleware;

type WithMiddlewareCreatorAsync = (
  validator: () => boolean,
  onError: () => void,
) => WithMiddlewareAsync;

const withMiddlewareCreator: WithMiddlewareCreator = (validator, onError) => {
  const withMiddleware: WithMiddleware = (next) => {
    const closure = (...args: Parameters<typeof next>): void => {
      if (!validator()) {
        onError();

        return;
      }
      next(...args);
    };

    return closure;
  };

  return withMiddleware;
};

const withMiddlewareCreatorAsync: WithMiddlewareCreatorAsync = (validator, onError) => {
  const withMiddleware: WithMiddlewareAsync = (next) => {
    const closure = async (...args: Parameters<typeof next>): Promise<void> => {
      if (!validator()) {
        onError();

        return;
      }
      await next(...args);
    };

    return closure;
  };

  return withMiddleware;
};

export {
  withMiddlewareCreator,
  withMiddlewareCreatorAsync,
  noMiddleware,
  noMiddlewareAsync,
};

export type {
  WithMiddleware,
  WithMiddlewareAsync
}
