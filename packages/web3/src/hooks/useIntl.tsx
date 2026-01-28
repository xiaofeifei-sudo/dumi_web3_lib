export interface IntlType<T extends string = string> {
  messages: Record<T, string>;
  getMessage: (message: string, values?: Record<string, string>) => string;
}

export default function useIntl<T extends string = string>(): IntlType<T> {
  return {
    messages: {} as Record<T, string>,
    getMessage: (message, values) => {
      if (values) {
        return message.replace(/\{([\w\.]+)\}/g, (_, key) => values[key]);
      }
      return message;
    },
  };
}
