
export class ScopeIdentifier implements ScopeExpression {
  name: string;
  eval(this: ScopeIdentifier, context: V_ValueHolder): ScopeValue {
    return context.get(this.target);
  }
  target: string;

  constructor(target: string) {
    this.target = target;
    this.name = "VarGet";
  }
}
export class ScopeAssignmentExpression implements ScopeExpression {
  init: ScopeExpression;
  id:ScopeIdentifier;
  name: string;
  eval(this: ScopeAssignmentExpression, context: V_ValueHolder): ScopeValue {
    return context.set(this.id.target,this.init.eval(context));
  }
  constructor(id:ScopeIdentifier,init:ScopeExpression) {
    this.id=id;
    this.init=init;
    this.name = "VarAssin";
  }
}

export class ScopeUpdateExpression implements ScopeExpression {
  argument: ScopeExpression;
  right: ScopeExpression;
  operator:string
  name: string;
  prefix:boolean;
  eval(this: ScopeUpdateExpression, context: V_ValueHolder): ScopeValue {
    if(this.operator=="++"){
      var l=this.argument.eval(context);

      if(l instanceof ScopeLiteral){
        try{
          var out=new ScopeLiteral(l.value+1);
          var as=new ScopeAssignmentExpression(this.argument as ScopeIdentifier,out).eval(context);
          if(this.prefix){
            return out;
          }else{
            return l;
          }
        }catch(e){

        }
      }
    }
    if(this.operator=="--"){
      var l=this.argument.eval(context);

      if(l instanceof ScopeLiteral){
        try{
          var out=new ScopeLiteral(l.value-1);
          var as=new ScopeAssignmentExpression(this.argument as ScopeIdentifier,out).eval(context);
          if(this.prefix){
            return out;
          }else{
            return l;
          }
        }catch(e){

        }
      }
    }
    return new V_Undefined();
  }
  parameters: Array<ScopeExpression>;
  constructor(argument:ScopeExpression,operator:string,prefix:boolean) {
    this.argument=argument;
    this.operator=operator;
    this.prefix=prefix;
    this.name = "UpExp";
  }
}



export class ScopeObjectExpression implements ScopeExpression {
  name: string;
  eval(this: ScopeObjectExpression, context: V_ValueHolder): ScopeValue {
    return new ScopeObject(context);
  }
  constructor(){
    this.name="OBJ";
  }
}
export class ScopeObject implements ScopeCallee, V_ValueHolder {
  eval(this: ScopeObject, parameters: Array<ScopeExpression>, context: V_ValueHolder): ScopeValue {
    var sc = new V_Scope();
    return this.body.eval(parameters,sc);
  }
  knows(this: ScopeObject, key: string): boolean {
    return this.has(key);
  }
  has(this: ScopeObject, key: string): boolean {
    return !(!this.properties[key]);
  }
  get(this: ScopeObject, key: string): ScopeValue {
    if(this.has(key)){
      return this.properties[key];
    }
    return new V_Undefined();
  }
  set(this: ScopeObject, key: string, value: ScopeValue): ScopeValue {
    return this.properties[key] = value;
  }
  setAction(this: ScopeObject, value: ScopeValue): ScopeValue {
    return this.body;
  }
  public properties: { [key:string]: ScopeValue };
  public parameterMap: V_PointerMap;
  public body: ScopeCallee;
  constructor(context:V_ValueHolder,parameterMap?:V_PointerMap) {
    this.parameterMap = new V_PointerMap();
    this.body=new V_Block([],context);
  }
}
