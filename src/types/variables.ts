import { ScopeValue } from "./value";
import { V_ValueHolder } from "./scopes";
import { ScopeExpression } from "./expression";
import { E_Literal } from "./literals";
export enum VariableType {
  VAR,
  CONST,
  CHANGE
}
export class V_VariablePointer implements ScopeValue {
  base(this: V_VariablePointer): ScopeValue {
    return this.getValue().base();
  }
  targetHolder: V_ValueHolder;
  targetPath: string[];
  memberType:string;
  setValue(type: VariableType, value: ScopeValue, context: V_ValueHolder): ScopeValue {
    if (type == VariableType.CHANGE|| this.memberType=="object") {
      return this.targetHolder.set(VariableType.VAR, this.targetPath[0], value);
    } else {
      return context.set(type, this.targetPath[0], value);
    }
  }
  getValue(): ScopeValue {
    return this.targetHolder.get(this.targetPath[0]);
  }
  constructor(targetHolder: V_ValueHolder, targetPath: string[]) {
    this.targetHolder = targetHolder;
    this.targetPath = targetPath;
  }
}
export class E_VariablePointer implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_VariablePointer, context: V_ValueHolder): V_VariablePointer {
    return context.pointer(this.targetPath[0]);
  }
  targetPath: string[];
  constructor(targetPath: string[]) {
    this.targetPath = targetPath;
  }
}
export class E_MemberExpression implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_MemberExpression, context: V_ValueHolder): V_VariablePointer {
    var p=(this.targetObj.eval(context).base() as V_ValueHolder).pointer(this.targetProp instanceof E_VariablePointer && !this.computed ? this.targetProp.targetPath[0] : this.targetProp.eval(context).base().value+"");
    p.memberType="object";
    //console.log("M:",this,p);
    return p;
  }
  targetObj: ScopeExpression;
  targetProp: ScopeExpression;
  computed:boolean;
  constructor(targetObj: ScopeExpression, targetProp: ScopeExpression,computed?:boolean) {
    this.targetObj=targetObj;
    this.targetProp = targetProp;
    this.computed=computed;
  }
}

export class E_VariableDeclaration implements ScopeExpression {
  start: Number;
  end: Number;
  declarations: Array<E_VariableDeclarator>;
  eval(this: E_VariableDeclaration, context: V_ValueHolder): ScopeValue {
    return this.declarations.map(x => x.eval(context))[0];
  }
  constructor(declarations: Array<E_VariableDeclarator>) {
    this.declarations = declarations;
    for(var i=0;i<this.declarations.length;i++){
      this.declarations[i].kind=VariableType.VAR;
    }
  }
}
export class E_VariableDeclarator implements ScopeExpression {
  start: Number;
  end: Number;
  init: ScopeExpression;
  id: E_VariablePointer;
  kind:VariableType;
  eval(this: E_VariableDeclarator, context: V_ValueHolder): ScopeValue {
    return this.id.eval(context).setValue(this.kind, this.init.eval(context).base(), context);//context.set(this.id.eval(),this.init.eval(context));
  }
  constructor(id: E_VariablePointer, init: ScopeExpression,kind?:VariableType) {
    this.id = id;
    this.init = init;
    this.kind=kind?kind:VariableType.CHANGE;
  }
}
