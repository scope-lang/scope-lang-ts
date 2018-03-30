import {ScopeValue} from "./value";
import { V_ValueHolder } from "./scopes";
export enum VariableType {
  VAR,
  LET,
  CONST,
  CHANGE
}
export class V_VariablePointer implements ScopeValue {
  targetHolder:V_ValueHolder;
  targetPath:string[];
  constructor(targetHolder:V_ValueHolder,targetPath:string[]) {
    this.targetHolder=targetHolder;
    this.targetPath=targetPath;
  }
}
