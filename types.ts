export interface ScopePropertyHolder extends ScopeValue {
  properties:{ [key:string]: ScopeValue };
  get(this: ScopePropertyHolder, key: string): ScopeValue;
  set(this: ScopePropertyHolder, key: string, value: ScopeValue): ScopeValue;
  has(this: ScopePropertyHolder,key:string):boolean;
  knows(this: ScopePropertyHolder,key:string):boolean;
}
export class ScopeScope implements ScopePropertyHolder {
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
    if(this.parent && this.parent.knows(key)){
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
export interface ScopeExpression {
  name: string;
  eval(this: ScopeExpression, context: ScopePropertyHolder): ScopeValue;
}
export interface ScopeValue {

}
export class ScopeUndefined implements ScopeValue, ScopeExpression {
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
export class ScopeIdentifier implements ScopeExpression {
  name: string;
  eval(this: ScopeIdentifier, context: ScopePropertyHolder): ScopeValue {
    return context.get(this.target);
  }
  target: string;

  constructor(target: string) {
    this.target = target;
    this.name = "VarGet";
  }
}
export class ScopeCall implements ScopeExpression {
  name: string;
  eval(this: ScopeCall, context: ScopePropertyHolder): ScopeValue {
    //console.log("CALL",this.target.eval(context));
    //console.log("PARMA",this.parameters);
    return (this.target.eval(context) as ScopeExec).eval(this.parameters, context);
  }
  target: ScopeExpression;
  parameters: Array<ScopeExpression>;
  constructor(target: ScopeExpression, parameters: Array<ScopeExpression>) {
    this.target = target;
    this.parameters=parameters;
    this.name = "Call";
  }
}
export class ScopeVariableDeclaration implements ScopeExpression {
  declarations: Array<ScopeVariableDeclarator>;
  name: string;
  eval(this: ScopeVariableDeclaration, context: ScopePropertyHolder): ScopeValue {
    return this.declarations.map(x=>x.eval(context));
  }
  constructor(declarations: Array<ScopeVariableDeclarator>) {
    this.declarations=declarations;
    this.name = "VarDec";
  }
}
export class ScopeVariableDeclarator implements ScopeExpression {
  init: ScopeExpression;
  id:ScopeIdentifier;
  name: string;
  eval(this: ScopeVariableDeclarator, context: ScopePropertyHolder): ScopeValue {
    return context.set(this.id.target,this.init.eval(context));
  }
  constructor(id:ScopeIdentifier,init:ScopeExpression) {
    this.id=id;
    this.init=init;
    this.name = "VarDecR";
  }
}
export class ScopeAssignmentExpression implements ScopeExpression {
  init: ScopeExpression;
  id:ScopeIdentifier;
  name: string;
  eval(this: ScopeAssignmentExpression, context: ScopePropertyHolder): ScopeValue {
    return context.set(this.id.target,this.init.eval(context));
  }
  constructor(id:ScopeIdentifier,init:ScopeExpression) {
    this.id=id;
    this.init=init;
    this.name = "VarAssin";
  }
}
function falsey(v:ScopeValue):boolean{
  if(v instanceof ScopeLiteral){
    return !v.value;
  }
  if(v instanceof ScopeUndefined){
    return true;
  }
  return false;
}
export class ScopeForStatement implements ScopeExpression {
  init: ScopeExpression;
  test: ScopeExpression;
  update: ScopeExpression;
  body: ScopeExpression;
  name: string;
  eval(this: ScopeForStatement, context: ScopePropertyHolder): ScopeValue {
    var subCtx=new ScopeScope(context);
    this.init.eval(subCtx)
    //console.log("t",this.test.eval(subCtx));
    for(;!falsey(this.test.eval(subCtx));this.update.eval(subCtx)){
      var q=this.body.eval(subCtx);
      if(q instanceof ScopeBlock){
        q=q.eval([],subCtx);
      }
      //this.body.eval(subCtx);
    }
    return new ScopeUndefined();
  }
  target: ScopeExpression;
  constructor(init:ScopeExpression,test:ScopeExpression,update:ScopeExpression,body:ScopeExpression) {
    this.init=init;
    this.test=test;
    this.update=update;
    this.body=body;
    this.name = "For";
  }
}
export class ScopeBinaryExpression implements ScopeExpression {
  left: ScopeExpression;
  right: ScopeExpression;
  operator:string
  name: string;
  eval(this: ScopeBinaryExpression, context: ScopePropertyHolder): ScopeValue {
    if(this.operator=="+"){
      var l=this.left.eval(context);
      var r=this.right.eval(context);
      if(l instanceof ScopeLiteral && r instanceof ScopeLiteral){
        try{
          return new ScopeLiteral(l.value+r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="<"){
      var l=this.left.eval(context);
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context);
      if(l instanceof ScopeLiteral && r instanceof ScopeLiteral){
        try{
          return new ScopeLiteral(l.value<r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="-"){
      var l=this.left.eval(context);
      var r=this.right.eval(context);
      if(l instanceof ScopeLiteral && r instanceof ScopeLiteral){
        try{
          return new ScopeLiteral(l.value-r.value);
        }catch(e){

        }
      }
    }
    if(this.operator==">"){
      var l=this.left.eval(context);
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context);
      if(l instanceof ScopeLiteral && r instanceof ScopeLiteral){
        try{
          return new ScopeLiteral(l.value>r.value);
        }catch(e){

        }
      }
    }
    return new ScopeUndefined();
  }
  parameters: Array<ScopeExpression>;
  constructor(left:ScopeExpression,right:ScopeExpression,operator:string) {
    this.left=left;
    this.right=right;
    this.operator=operator;
    this.name = "BinExp";
  }
}
export class ScopeUpdateExpression implements ScopeExpression {
  argument: ScopeExpression;
  right: ScopeExpression;
  operator:string
  name: string;
  prefix:boolean;
  eval(this: ScopeUpdateExpression, context: ScopePropertyHolder): ScopeValue {
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
    return new ScopeUndefined();
  }
  parameters: Array<ScopeExpression>;
  constructor(argument:ScopeExpression,operator:string,prefix:boolean) {
    this.argument=argument;
    this.operator=operator;
    this.prefix=prefix;
    this.name = "UpExp";
  }
}
export class ScopeBlock implements ScopeValue, ScopeExec {
  name: string;
  parameterMap: ScopeReferenceMap;
  context:ScopePropertyHolder;
  expressions: Array<ScopeExpression>;
  eval(this: ScopeBlock, parameters: ScopeExpression[], context: ScopePropertyHolder): ScopeValue {
    //console.log(...parameters.map(x=>x.eval(context).toString()));
    var subCtx=new ScopeScope(this.context);
    this.parameterMap.apply(parameters,subCtx);
    var value: ScopeValue = new ScopeUndefined();
    for (var statement of this.expressions) {
      statement.eval(subCtx);
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
export class ScopeBody implements ScopeExpression {
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
export class ScopeString implements ScopeExpression, ScopeValue {
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
export class ScopeLiteral implements ScopeExpression, ScopeValue {
  value: Number|string|boolean|RegExp;
  name: string;
  eval(this: ScopeNumber, context: ScopePropertyHolder): ScopeValue {
    return this;
  }
  constructor(value:Number|string|boolean|RegExp) {
    this.value=value;
    this.name = "Lit";
  }
  toString(this:ScopeNumber):string{
    return this.value.toString();
  }
}
export class ScopeNumber implements ScopeExpression, ScopeValue {
  value: Number;
  name: string;
  eval(this: ScopeNumber, context: ScopePropertyHolder): ScopeValue {
    return this;
  }
  constructor(value:Number) {
    this.value=value;
    this.name = "Number";
  }
  toString(this:ScopeNumber):string{
    return this.value.toString();
  }
}
export class ScopeReferenceMap {
  keys: Array<string>;
  constructor() {
    this.keys = new Array<string>();
  }
  apply(this: ScopeReferenceMap, parameters: Array<ScopeValue>, context: ScopePropertyHolder) {
    for (var i = 0; i < Math.min(parameters.length, this.keys.length); i++) {
      context[this.keys[i]]=parameters[i];
    }
  }
}
export interface ScopeExec {
  parameterMap: ScopeReferenceMap;
  eval(this: ScopeExec, parameters: Array<ScopeExpression>, context: ScopePropertyHolder): ScopeValue;
}
export class ScopeNativePrint implements ScopeExec {
  parameterMap: ScopeReferenceMap;
  eval(this: ScopeExec, parameters: ScopeExpression[], context: ScopePropertyHolder): ScopeValue {
    console.log(...parameters.map(x=>x.eval(context).toString()));
    return new ScopeUndefined();
  }
  constructor() {
    this.parameterMap= new ScopeReferenceMap();
  }
}
export class ScopeObject implements ScopeExec, ScopePropertyHolder {
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
