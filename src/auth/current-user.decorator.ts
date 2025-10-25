import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType<string>() === 'http') {
    return context.switchToHttp().getRequest().user;
  }

  if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
