/*
*
*
*       Complete the handler logic below
*       
*       
*/
const math = require('mathjs');


function ConvertHandler() {
  
this.getNum = function(input) {
    if (!input) return 'invalid number and unit'
    const numReg = /[\d./]+/g;
    // Input has no number, only a unit
    if (input.match(numReg) === null) return 1;
    
    // Strip input of valid/invalid units
    const unitRegex = /([^\d]+$)/;
    const numOrEq = input.replace(unitRegex, '');
    // console.log(input);
    
    const letterRegex=/[a-zA-Z]+/;
    // Input is something like '1a3lbs' or 'a4gal'
    if (numOrEq.match(letterRegex)) return 'invalid number';
    
    const result = math.evaluate(numOrEq);
    
    return result.toFixed(5);
  };
  
  this.getUnit = function(input) {
    if (!input) return 'invalid number and unit'
    const allowedUnits=['gal','l','mi','km','lbs','kg','L'];
    var result;
    let unitReg=/[a-zA-Z]+$/
    result=input.match(unitReg)
    if (!result) return 'no unit'
    let unit=result[0].toLowerCase();
    if (allowedUnits.indexOf(unit)===-1){
      return 'invalid unit'
    }
    return unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    const unitMap = {
      'lbs' :'kg',
      'gal' :'l',
      'mi':'km',
      'km':'mi',
      'l':'gal',
      'kg':'lbs'}
    console.log(unitMap[initUnit.toLowerCase()])
    return unitMap[initUnit.toLowerCase()];
  };

  this.spellOutUnit = function(unit) {
    const spelled = {
      lb:'pounds',
      'mi':'miles',
      'km':'kilometers',
      'gal':'gallons',
      'l':'liters',
      'kg':'kilogram'
    }    
    return spelled[unit.toLowerCase()];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    if (initUnit == 'lbs'){
      result = initNum*lbsToKg;
    }else if (initUnit == 'kg'){
      result = initNum/lbsToKg;
    }else if (initUnit == 'mi'){
      result = initNum*miToKm;
    }else if (initUnit == 'gal'){
      result = initNum*galToL;
    }else if (initUnit == 'l'){
      result = initNum/galToL;
    }else if (initUnit == 'km'){    
    result = initNum/miToKm;}
    return result.toFixed(5)
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result = {
      initNum:Number(initNum),
      initUnit:initUnit,
      returnNum:Number(returnNum),
      returnUnit:returnUnit,
      string:parseInt(initNum) +' '+this.spellOutUnit(initUnit) +' converts to ' + parseInt(returnNum)+' '+this.spellOutUnit(returnUnit)
    }
    console.log(result)
    return result;
  };
  
}

module.exports = ConvertHandler;
