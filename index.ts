interface ScopePropertyHolder extends ScopeValue {
  properties:{ [key:string]: ScopeValue };
  get(this: ScopePropertyHolder, key: string): ScopeValue;
  set(this: ScopePropertyHolder, key: string, value: ScopeValue): ScopeValue;
  has(this: ScopePropertyHolder,key:string):boolean;
  knows(this: ScopePropertyHolder,key:string):boolean;
}
class ScopeScope implements ScopePropertyHolder {
  public parent?:ScopePropertyHolder;
  knows(this: ScopeScope, key: string): boolean {
    if(this.parent){
      return this.has(key)||this.parent.knows(key);
    }
    return this.has(key);
  }
  has(this: ScopePropertyHolder, key: string): boolean {
    return !(!this.properties[key]);
  }
  get(this: ScopeScope, key: string): ScopeValue {
    if(this.has(key)){
      return this.properties[key];
    }
    if(this.parent.knows(key)){
      return this.parent.get(key);
    }
    return new ScopeUndefined();
  }
  set(this: ScopeScope, key: string, value: ScopeValue): ScopeValue {
    if(this.has(key)){
      return this.properties[key] = value;
    }
    if(this.parent.has(key)){
      return this.parent.set(key,value);
    }
    return this.properties[key] = value;
  }
  public properties: { [key:string]: ScopeValue };
  constructor(parent?:ScopePropertyHolder){
    this.properties={};
    if(parent){
      this.parent=parent;
    }
  }
}
interface ScopeExpression {
  name: string;
  eval(this: ScopeExpression, context: ScopePropertyHolder): ScopeValue;
}
interface ScopeValue {

}
class ScopeUndefined implements ScopeValue, ScopeExpression {
  name: string;
  eval(this: ScopeExpression, context: ScopePropertyHolder): ScopeValue {
    return this;
  }
  constructor(){
    this.name="Undefined";
  }
  toString(this:ScopeUndefined):string{
    return undefined;
  }
}
class ScopeCall implements ScopeExpression {
  name: string;
  eval(this: ScopeCall, context: ScopePropertyHolder): ScopeValue {
    return this.target.eval(this.parameters, context);
  }
  target: ScopeExec;
  parameters: Array<ScopeExpression>;
  constructor(target: ScopeExec, parameters: Array<ScopeExpression>) {
    this.target = target;
    this.parameters=parameters;
    this.name = "Call";
  }
}
class ScopeBlock implements ScopeValue, ScopeExec {
  name: string;
  parameterMap: ScopeReferenceMap;
  context:ScopePropertyHolder;
  expressions: Array<ScopeExpression>;
  eval(this: ScopeBlock, parameters: ScopeExpression[], context: ScopePropertyHolder): ScopeValue {
    //console.log(...parameters.map(x=>x.eval(context).toString()));
    var value: ScopeValue = new ScopeUndefined();
    for (var statement of this.expressions) {
      statement.eval(this.context);
    }
    return value;
    //return new ScopeUndefined();
  }
  constructor(expressions:Array<ScopeExpression>,context: ScopePropertyHolder) {
    this.parameterMap= new ScopeReferenceMap();
    this.expressions=expressions;
    this.context=context;
  }
}
class ScopeBody implements ScopeExpression {
  name: string;
  eval(this: ScopeBody, context: ScopePropertyHolder): ScopeBlock {
    return new ScopeBlock(this.expressions,context);
  }
  expressions: Array<ScopeExpression>;
  constructor(expressions?:Array<ScopeExpression>) {
    this.expressions = expressions?expressions:new Array<ScopeExpression>();
    this.name = "Body";
  }
}
class ScopeString implements ScopeExpression, ScopeValue {
  value: string;
  name: string;
  eval(this: ScopeString, context: ScopePropertyHolder): ScopeValue {
    return this;
  }
  constructor(value:string) {
    this.value=value;
    this.name = "String";
  }
  toString(this:ScopeString):string{
    return this.value;
  }
}
class ScopeNumber implements ScopeExpression, ScopeValue {
  value: Number;
  name: string;
  eval(this: ScopeNumber, context: ScopePropertyHolder): ScopeValue {
    return this;
  }
  constructor(value:Number) {
    this.value=value;
    this.name = "String";
  }
  toString(this:ScopeNumber):string{
    return this.value.toString();
  }
}
class ScopeReferenceMap {
  keys: Array<string>;
  constructor() {
    this.keys = new Array<string>();
  }
  apply(this: ScopeReferenceMap, parameters: Array<ScopeValue>, context: ScopePropertyHolder) {
    for (var i = 0; i < Math.min(parameters.length, this.keys.length); i++) {
      context.set(this.keys[i], parameters[i]);
    }
  }
}
interface ScopeExec {
  parameterMap: ScopeReferenceMap;
  eval(this: ScopeExec, parameters: Array<ScopeExpression>, context: ScopePropertyHolder): ScopeValue;
}
class ScopeNativePrint implements ScopeExec {
  parameterMap: ScopeReferenceMap;
  eval(this: ScopeExec, parameters: ScopeExpression[], context: ScopePropertyHolder): ScopeValue {
    console.log(...parameters.map(x=>x.eval(context).toString()));
    return new ScopeUndefined();
  }
  constructor() {
    this.parameterMap= new ScopeReferenceMap();
  }
}
class ScopeObject implements ScopeExec, ScopePropertyHolder {
  eval(this: ScopeObject, parameters: Array<ScopeExpression>, context: ScopePropertyHolder): ScopeValue {
    var sc = new ScopeScope();
    this.parameterMap.apply(parameters.map(function(x) { return x.eval(context) }), sc);
    return this.body.eval(sc);
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
    return new ScopeUndefined();
  }
  set(this: ScopeObject, key: string, value: ScopeValue): ScopeValue {
    return this.properties[key] = value;
  }
  public properties: { [key:string]: ScopeValue };
  public parameterMap: ScopeReferenceMap;
  public body: ScopeBody;
  constructor(parameterMap?:ScopeReferenceMap,) {
    this.parameterMap = new ScopeReferenceMap();
    this.body=new ScopeBody();
  }
}
function run(program: ScopeBody) {
  var global = new ScopeScope();
  return program.eval(global).eval([],global);
}
function test() {
  var program: ScopeBody = new ScopeBody();
  program.expressions.push(new ScopeCall(new ScopeNativePrint(),[new ScopeString("hello"), new ScopeUndefined(),new ScopeNumber(10)]));
  run(program);
}
test();
