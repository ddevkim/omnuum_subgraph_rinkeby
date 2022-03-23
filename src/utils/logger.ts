export enum LogMessage {
  ___NO_ENTITY,
}

export const getDebugMessgage = (logKeyword: LogMessage): string => {
  switch (logKeyword) {
    case LogMessage.___NO_ENTITY:
      return '___NO_ENTITY';
    default:
      return '___UNRECOGNIZED_LOG_MESSAGE';
  }
};
