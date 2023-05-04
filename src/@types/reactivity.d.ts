import { Ref } from '@vue/reactivity'

declare module '@vue/reactivity' {
  export interface Ref<T> extends Ref<T> {
    _rawValue: T
  }
}
