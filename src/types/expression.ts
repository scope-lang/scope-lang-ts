import {ScopeValue} from "./value";
import { V_ValueHolder } from "./scopes";
export interface ScopeExpression {
  start:Number;
  end:Number;
  eval(this: ScopeExpression, context: V_ValueHolder): ScopeValue;
}
